function TextDrawer(image, layout, line_height) {
    this.image = image;
    this.layout = layout;
    this.line_height = line_height;
}

TextDrawer.prototype.draw = function(ctx, x, y, text) {
    text = ('' + text).toUpperCase();
    let pos_x = x,
        pos_y = y;
    for (let char of text) {
        let layout = this.layout[char];
        if (layout) {
            let [cx, cy, cw, ch] = layout['rect'];
            let [ox, oy] = layout['offset'];
            ctx.drawImage(this.image, cx, cy, cw, ch, pos_x - ox, pos_y - oy, cw, ch);
            pos_x += layout['advance'];
        } else if (char == '\n') {
            pos_x = x;
            pos_y += this.line_height;
        }
    }
}

let status_font_image = new Image();
status_font_image.src = '#colorizedfontdatauri{e1d1ac,assets/fonts/kenney_mini_regular_12.png}';
let layout = {/* ghltojsobj{assets/fonts/kenney_mini_regular_12.xml} */};
let status_font = new TextDrawer(status_font_image, layout, 20);
