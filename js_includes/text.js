class TextDrawer {
    constructor(image, layout, line_height) {
        this.image = image;
        this.layout = layout;
        this.line_height = line_height;
    }

    draw(ctx, x, y, text) {
        let uptext = ('' + text).toUpperCase(),
            pos_x = x,
            pos_y = y;
        for (let char of uptext) {
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

    measure(text) {
        let uptext = ('' + text).toUpperCase(),
            max_width = 0,
            width = 0,
            height = this.line_height;
        for (let char of uptext) {
            let layout = this.layout[char];
            if (layout) {
                // let [cx, cy, cw, ch] = layout['rect'];
                // let [ox, oy] = layout['offset'];
                width += layout['advance'];

            } else if (char == '\n') {
                max_width = Math.max(width, max_width);
                width = 0;
                height += this.line_height;
            }
        }
        return [Math.max(width, max_width), height]
    }

    draw_centered(ctx, text, y) {
        let pos_y = y,
            uptext = ('' + text).toUpperCase(),
            lines = uptext.split('\n');
        if (pos_y === undefined) {
            let height = (lines.length - 1) * this.line_height;
            pos_y = ((ctx.canvas.height - height) / 2) | 0;
        }
        for (let line of lines) {
            let pos_x = ((ctx.canvas.width - this.measure(line)[0]) / 2) | 0;
            this.draw(ctx, pos_x, pos_y, line);
            pos_y += this.line_height;
        }
    }

    draw_bottom_centered(ctx, text) {
        let uptext = ('' + text).toUpperCase(),
            lines = uptext.split('\n'),
            height = (lines.length - 1) * this.line_height,
            y = ctx.canvas.height - height - 10;
        this.draw_centered(ctx, text, y)
    }
}


let status_font_image = new Image();
status_font_image.src = '#colorizedfontdatauri{e1d1ac,assets/fonts/kenney_mini_regular_12.png}';
let status_font_layout = {/* ghltojsobj{assets/fonts/kenney_mini_regular_12.xml} */};
let status_font = new TextDrawer(status_font_image, status_font_layout, 20);

let status_number_font_image = new Image();
status_number_font_image.src = '#colorizedfontdatauri{e1d1ac,assets/fonts/kenney_rocket_square_regular_12.png}';
let status_number_font_layout = {/* ghltojsobj{assets/fonts/kenney_rocket_square_regular_12.xml} */};
let status_number_font = new TextDrawer(status_number_font_image, status_number_font_layout, 20);

let big_font_image = new Image();
big_font_image.src = '#colorizedfontdatauri{ede8b2,assets/fonts/kenney_mini_regular_50.png}';
let big_font_layout = {/* ghltojsobj{assets/fonts/kenney_mini_regular_50.xml} */};
let big_font = new TextDrawer(big_font_image, big_font_layout, 50);

let normal_font_image = new Image();
normal_font_image.src = '#colorizedfontdatauri{b48ab5,assets/fonts/kenney_mini_regular_14.png}';
let normal_font_layout = {/* ghltojsobj{assets/fonts/kenney_mini_regular_14.xml} */};
let normal_font = new TextDrawer(normal_font_image, normal_font_layout, 15);
