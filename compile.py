#!/usr/bin/env python3
import re
import base64
import tempfile
import os
import subprocess
from termcolor import colored


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


code = re.sub(r'#base64{([a-z0-9/\.-_]+)}', replace_base64, code)
code = re.sub(r'#datauri{([a-z/]+),([a-z0-9/\.-_]+)}', replace_datauri, code)

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
