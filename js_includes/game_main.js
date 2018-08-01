// include_once{bow.js}
// include_once{images.js}
// include_once{levels.js}
// include_once{bow_events.js}
// include_once{text.js}
// include_once{sounds.js}

let bow = new Bow(80, 3),
    arrows_remaining = 0,
    arrows = [],
    level_n,
    level,
    level_change = false,
    last_arrow_timeout = null,
    score = 0,
    score_to_add = 0;

localStorage['best_score'] = localStorage['best_score'] || 0;

function add_arrow(arrow) {
    arrows.push(arrow);
    if (!arrows_remaining) {
        last_arrow_timeout = setTimeout(_ => onlevelend(false), 5000);
    }
}

function add_score(count) {
    score_to_add += count;
}

function score_to_str(score) {
    let score_str = '' + score;
    return '0'.repeat(6 - score_str.length) + score_str;
}

function change_remaining_arrows_to_score(callback) {
    if (arrows_remaining) {
        add_score(50);
        --arrows_remaining;
        setTimeout(change_remaining_arrows_to_score, 1000, callback);
    } else {
        setTimeout(callback, 1000);
    }
}

function run_level() {
    level = construct_level(level_n, onlevelend);
    arrows_remaining = level.arrows_limit;
    level_change = false;
}

function onlevelend(success) {
    clearTimeout(last_arrow_timeout);
    last_arrow_timeout = null;
    level_change = true;
    bow.strain();
    bow.release_arrow(_=>{});
    arrows = [];
    if (success) {
        play(win_sound);
        function cb() {
            ++level_n;
            if (level_n > levels_count) {
                level_n = 1;
            }
            run_level();
        }
        if (arrows_remaining) {
            change_remaining_arrows_to_score(cb);
        } else {
            cb();
        }
    } else {
        if (success === false) {
            play(lose_sound);
        }
        level_n = 1;
        score = 0;
        run_level();
    }
}

function draw() {
    if (!level_change) {
        ctx.drawImage(level.bg_image, 0, 0, level.bg_image.width, level.bg_image.height, 0, 0, canvas_width, canvas_height);
        bow.drawOn(ctx);
        for (let arrow of arrows) {
            ctx.drawImage(arrow_image, arrow.x, arrow.y);
        }
        level.draw_on(ctx);
    } else {
        ctx.drawImage(level.bg_image, 0, 0, level.bg_image.width, 18, 0, 0, canvas_width, 36);
    }

    status_font.draw(ctx, 5, 20, 'score');
    status_number_font.draw(ctx, 35, 20, score_to_str(score));
    status_font.draw(ctx, 11, 35, 'best');
    status_number_font.draw(ctx, 35, 35, score_to_str(localStorage['best_score']));
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
    if (!level_change) {
        level.update(arrows);
        arrows = arrows.filter(arrow => {
            arrow.x += arrow.speed;
            return arrow.x < canvas_width && arrow.x > -arrow_width;
        });
    }
    if (score_to_add > 0) {
        ++score;
        --score_to_add;
        if (score > localStorage['best_score']) {
            localStorage['best_score'] = score;
        }
    }
    setTimeout(update, 20);
}

onlevelend(); // argument undefined on purpose
update();
draw();
