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
    last_arrow_timeout = null,
    score = 0,
    score_to_add = 0,
    blink_val = 0;

localStorage['best_score'] = localStorage['best_score'] || 0;

let GameState = Object.freeze({
    LEVEL_INFO: 1,
    LEVEL_PLAY: 2,
    LEVEL_PASSED: 3,
    LEVEL_FAILED: 4
});
let game_state = GameState.LEVEL_INFO;

document.addEventListener('click', e => {
    if (game_state == GameState.LEVEL_INFO && e.which == 1) {
        game_state = GameState.LEVEL_PLAY;
    }
});

function add_arrow(arrow) {
    arrows.push(arrow);
    if (!arrows_remaining) {
        last_arrow_timeout = setTimeout(_ => onlevelend(false), 5500);
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
        setTimeout(callback, 3000);
    }
}

function prepare_level() {
    level = construct_level(level_n, onlevelend);
    arrows_remaining = level.arrows_limit;
    game_state = GameState.LEVEL_INFO;
}

function onlevelend(success) {
    clearTimeout(last_arrow_timeout);
    last_arrow_timeout = null;

    bow.strain();
    bow.release_arrow(_=>{});
    arrows = [];

    if (success) {
        play(win_sound);
        game_state = GameState.LEVEL_PASSED;
        change_remaining_arrows_to_score(_ => {
            ++level_n;
            if (level_n > levels_count) {
                level_n = 1;
            }
            prepare_level();
        });
    } else {
        if (success === false) {
            play(lose_sound);
            game_state = GameState.LEVEL_FAILED;
            setTimeout(_ => {
                level_n = 1;
                score = 0;
                prepare_level();
            }, 5000);
        } else {
            level_n = 1;
            score = 0;
            prepare_level();
        }
    }
}

function draw() {
    switch (game_state) {
    case GameState.LEVEL_INFO:
        ctx.drawImage(level.bg_image, 0, 0, level.bg_image.width, level.bg_image.height, 0, 0, canvas_width, canvas_height);
        bow.drawOn(ctx);
        big_font.draw_centered(ctx, `Level ${level_n}\n${level.title}`);
        normal_font.draw_bottom_centered(ctx, level.description);
        ctx.save();
            if (blink_val < 50) {
                ctx.globalAlpha = blink_val * 0.02;
            } else if (blink_val < 75) {
                // alpha == 1
            } else {
                ctx.globalAlpha = (125 - blink_val) * 0.02;
            }
            status_font.draw_centered(ctx, 'Left click to start!', 50);
        ctx.restore();
        break;

    case GameState.LEVEL_PLAY:
        ctx.drawImage(level.bg_image, 0, 0, level.bg_image.width, level.bg_image.height, 0, 0, canvas_width, canvas_height);
        bow.drawOn(ctx);
        for (let arrow of arrows) {
            ctx.drawImage(arrow_image, arrow.x, arrow.y);
        }
        level.draw_on(ctx);
        break;

    case GameState.LEVEL_PASSED:
        ctx.drawImage(level.bg_image, 0, 0, level.bg_image.width, 18, 0, 0, canvas_width, 36);
        big_font.draw_centered(ctx, `Well done!`);
        normal_font.draw_bottom_centered(ctx, 'You get 50 points for each unused arrow');
        break;

    case GameState.LEVEL_FAILED:
        ctx.drawImage(level.bg_image, 0, 0, level.bg_image.width, 18, 0, 0, canvas_width, 36);
        big_font.draw_centered(ctx, `Not this time!`);
        normal_font.draw_bottom_centered(ctx, 'You clearly need more practice');
        break;

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
        status_font.draw(ctx, canvas_width - 70, 45, `used colors: ${check_colors_and_get_count()}`);
    }

    requestAnimationFrame(draw);
}

function update() {
    blink_val += 1;
    if (blink_val >= 125) {
        blink_val = 0;
    }
    if (game_state == GameState.LEVEL_PLAY) {
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
