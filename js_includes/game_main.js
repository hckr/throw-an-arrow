let ctx = c.getContext('2d'),
    canvas_width = c.width,
    canvas_height = c.height;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas_width, canvas_height);

ctx.fillStyle = 'black';
let indent_line = false;
for (let y = 0; y < canvas_height; y += 10) {
    let x = indent_line ? 10 : 0;
    indent_line = !indent_line;
    for (; x < canvas_width; x += 20) {
        console.log(x, y);
        ctx.fillRect(x, y, 10, 10);
    }
}
