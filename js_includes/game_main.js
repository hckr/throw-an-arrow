// include_once{bow.js}
// include_once{images.js}
// include_once{levels.js}
// include_once{bow_events.js}
// include_once{text.js}
// include_once{sounds.js}

let bow = new Bow(80),
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
        play(win_sound);
        ++level_n;
        if (level_n > levels_count) {
            level_n = 1;
        }
    } else {
        if (success === false) {
            play(lose_sound);
        }
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
    status_font.draw(ctx, 5, 20, 'score');
    status_font.draw(ctx, 35, 20, '000000');
    status_font.draw(ctx, canvas_width - 35, 20, 'arrows');
    ctx.fillStyle = '#e1d1ac';
    for (let pos_x = canvas_width - 42, arrows_drawn = 0; arrows_drawn < arrows_remaining; ++arrows_drawn, pos_x -= 3) {
        ctx.fillRect(pos_x, 12, 1, 8);
    }
    if (debug) {
        let count = check_colors_and_get_count();
        status_font.draw(ctx, canvas_width - 70, 45, `used colors: ${count}`);
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

onlevelend(); // argument undefined on purpose
update();
draw();
