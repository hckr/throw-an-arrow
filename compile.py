#!/usr/bin/env python3
import re
import base64
import tempfile
import os
import subprocess
import json
import xmltodict
import numpy as np
from termcolor import colored
from PIL import Image
from io import BytesIO


with open('main.js') as f:
    code = f.read()


already_included = set()


def replace_include(match):
    file_name = match.group(2)
    file_ext = os.path.splitext(file_name)[-1][1:]
    if match.group(1) == '_once' and file_name in already_included:
        return ''
    already_included.add(file_name)
    with open('{}_includes/{}'.format(file_ext, file_name)) as f:
        contents = f.read()
    return contents


while True:
    code, n = re.subn(r'(?://[ ]*|#)include(_once)?{([a-z0-9/\.-_]+)}', replace_include, code)
    if n == 0:
        break


def replace_base64(match):
    with open(match.group(1), 'rb') as f:
        contents = f.read()
    return base64.b64encode(contents).decode('utf-8')


def replace_datauri(match):
    with open(match.group(2), 'rb') as f:
        contents = f.read()
    return 'data:{};base64,{}'.format(match.group(1), base64.b64encode(contents).decode('utf-8'))


def replace_ghltojsobj(match):
    data = {}
    with open(match.group(1)) as f:
        xml = xmltodict.parse(f.read())
        for char in xml['font']['chars']['char']:
            data[char['@id']] = {
                'advance': int(char['@advance']),
                'rect': [int(x) for x in char['@rect'].split()],
                'offset': [int(x) for x in char['@offset'].split()]
            }
    return re.sub(r'"([a-zA-Z]+)"', r'\1', json.dumps(data)).replace('"', "'")


def replace_colorizedfontdatauri(match):
    h = match.group(1)
    rgb = tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
    # https://stackoverflow.com/a/3753428/5114473
    im = Image.open(match.group(2))
    im = im.convert('RGBA')
    data = np.array(im)
    red, green, blue, alpha = data.T
    white_areas = (red == 255) & (blue == 255) & (green == 255)
    data[..., :-1][white_areas.T] = rgb
    im2 = Image.fromarray(data)
    buffer = BytesIO()
    im2.save(buffer, format='PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(buffer.getvalue()).decode('utf-8')


code = re.sub(r'#base64{([a-z0-9/\.-_]+)}', replace_base64, code)
code = re.sub(r'#datauri{([a-z/]+),([a-z0-9/\.-_]+)}', replace_datauri, code)
code = re.sub(r'{/\*\s*ghltojsobj{([a-z0-9/\.-_]+)}\s*\*/}', replace_ghltojsobj, code)
code = re.sub(r'#colorizedfontdatauri{([0-9a-f]{6}),([a-z0-9/\.-_]+)}', replace_colorizedfontdatauri, code)

raw_len = len(code)

with open('debug_data/raw_output.js', 'w') as f:
    f.write(code)

with tempfile.NamedTemporaryFile('w') as f:
    f.write(code)
    code = subprocess.check_output(['uglifyjs', '--compress', '--mangle', 'toplevel', f.name]).decode('utf-8')

minified_len = len(code)

with open('debug_data/raw_output.min.js', 'w') as f:
    f.write(code)

with tempfile.NamedTemporaryFile('w') as f:
    f.write(code)
    os.system('ruby 3rd_party_tools/pnginator.rb {} index.html >/dev/null 2>&1'.format(f.name))
    size = os.stat('index.html').st_size
    print('{} bytes used, {} more to go! [raw js bundle: {}, minified: {}, {}% smaller after compression]'.format(
        colored(size, 'red', attrs=['reverse', 'bold']),
        colored(31337 - size, 'blue', attrs=['reverse', 'bold']),
        raw_len, minified_len, round((minified_len - size) / minified_len * 100)))
