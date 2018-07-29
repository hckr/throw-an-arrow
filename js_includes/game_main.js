// include_once{bow.js}
// include_once{images.js}
// include_once{levels.js}
// include_once{bow_events.js}

let bow = new Bow(30),
    arrows_remaining = 0,
    arrows = [],
    level_n,
    level,
    last_arrow_timeout = null;

function add_arrow(arrow) {
    arrows.push(arrow);
    if (!arrows_remaining) {
        last_arrow_timeout = setTimeout(_ => onlevelend(false), 5000);
    }
}

function onlevelend(success) {
    clearTimeout(last_arrow_timeout);
    last_arrow_timeout = null;
    if (success) {
        ++level_n;
        if (level_n > levels_count) {
            level_n = 1;
        }
    } else {
        level_n = 1;
    }
    level = construct_level(level_n, onlevelend);
    arrows_remaining = level.arrows_limit;
}

function draw() {
    ctx.drawImage(level.bg_image, 0, 0, level.bg_image.width, level.bg_image.height, 0, 0, canvas_width, canvas_height);
    bow.drawOn(ctx);
    for (let arrow of arrows) {
        ctx.drawImage(arrow_image, arrow.x, arrow.y);
    }
    level.drawOn(ctx);
    ctx.fillStyle = '#e1d1ac';
    for (let pos_x = canvas_width - 7, arrows_drawn = 0; arrows_drawn < arrows_remaining; ++arrows_drawn, pos_x -= 3) {
        ctx.fillRect(pos_x, 10, 1, 6);
    }
    requestAnimationFrame(draw);
}

function update() {
    level.update(arrows);
    arrows = arrows.filter(arrow => {
        arrow.x += 3;
        return arrow.x < canvas_width;
    });
    setTimeout(update, 20);
}

onlevelend(false);
update();
draw();
