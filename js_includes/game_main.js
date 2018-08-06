// include_once{bow.js}
// include_once{images.js}
// include_once{levels.js}
// include_once{bow_events.js}
// include_once{text.js}
// include_once{sounds.js}

let bow = new Bow(-46, 3),
    arrows_remaining = 0,
    arrows = [],
    level_n,
    level,
    score = 0,
    score_to_add = 0,
    blink_val = 0,
    last_arrow_handler_enabled = false;

localStorage['best_score'] = localStorage['best_score'] || 0;

let GameState = Object.freeze({
    TITLE_SCREEN: 1,
    LEVEL_INFO: 2,
    LEVEL_PLAY: 3,
    LEVEL_PASSED: 4,
    LEVEL_FAILED: 5,
    END_SCREEN: 6
});
let game_state = GameState.TITLE_SCREEN;

let TitleScreenState = Object.freeze({
    REVEALING_BOW: 1,
    FIRING_ARROW_1: 2,
    MOVING_BOW_1: 3,
    FIRING_ARROW_2: 4,
    MOVING_BOW_2: 5,
    FIRING_ARROW_3: 6,
    MOVING_BOW_3: 7,
    AFTER_INTRO: 8,
    BOW_TIMEOUT: 9
});
let title_screen_state = TitleScreenState.REVEALING_BOW,
    title_screen_arrows = [];

function click(e) {
    if (!is_fullscreen) {
        return;
    }
    if (e.which == 1) {
        switch (game_state) {
            case GameState.LEVEL_INFO:
                game_state = GameState.LEVEL_PLAY;
                break;
            case GameState.TITLE_SCREEN:
                if (title_screen_state != TitleScreenState.AFTER_INTRO) {
                    break;
                }
                // no break
            case GameState.END_SCREEN:
                level_n = 1;
                prepare_level();
                break;
        }
    }
}

document.addEventListener('click', click);

function add_arrow(arrow) {
    arrows.push(arrow);
    if (!arrows_remaining) {
        handle_last_arrow();
    }
}

function handle_last_arrow() {
    last_arrow_handler_enabled = true;
    setTimeout(function h() {
        if (!last_arrow_handler_enabled) {
            return;
        }
        if (arrows.length == 0 && level.can_safely_fail()) {
            onlevelend(false);
        } else {
            setTimeout(h, 500);
        }
    });
}

function add_score(count) {
    score_to_add += count;
}

function score_to_str(score) {
    let score_str = '' + score;
    return '0'.repeat(6 - score_str.length) + score_str;
}

function change_remaining_arrows_to_score(callback, orig_arrows_remaining) {
    if (arrows_remaining) {
        add_score(50);
        --arrows_remaining;
        setTimeout(change_remaining_arrows_to_score, 1000, callback, orig_arrows_remaining);
    } else {
        let t = 5000 - ((orig_arrows_remaining || 0) * 1000);
        if (t < 1000) {
            t = 1000;
        }
        setTimeout(callback, t);
    }
}

function prepare_level() {
    level = construct_level(level_n, onlevelend);
    arrows_remaining = level.arrows_limit;
    game_state = GameState.LEVEL_INFO;
}

function onlevelend(success) {
    last_arrow_handler_enabled = false;

    bow.strain();
    bow.release_arrow(_=>{});
    arrows = [];

    if (success) {
        play(win_sound);
        game_state = GameState.LEVEL_PASSED;
        change_remaining_arrows_to_score(_ => {
            ++level_n;
            if (level_n > levels_count) {
                game_state = GameState.END_SCREEN;
            } else {
                prepare_level();
            }
        });
    } else {
        play(lose_sound);
        game_state = GameState.LEVEL_FAILED;
        setTimeout(_ => {
            level_n = 1;
            score = 0;
            prepare_level();
        }, 5000);
    }
}

let throw_canvas = document.createElement('canvas'),
    an_canvas = document.createElement('canvas'),
    arrow_canvas = document.createElement('canvas'),
    throw_ctx = throw_canvas.getContext('2d'),
    an_ctx = an_canvas.getContext('2d'),
    arrow_ctx = arrow_canvas.getContext('2d');

[throw_canvas.width, throw_canvas.height] = big_font.measure('Throw');
[an_canvas.width, an_canvas.height] = big_font.measure('an');
[arrow_canvas.width, arrow_canvas.height] = big_font.measure('arrow');

big_font.draw(throw_ctx, 0, throw_canvas.height, 'Throw');
big_font.draw(an_ctx, 0, an_canvas.height, 'an');
big_font.draw(arrow_ctx, 0, arrow_canvas.height, 'arrow');

function draw_title_screen_line(index, canvas, pos_x, pos_y) {
    if (title_screen_arrows[index]) {
        let width = (title_screen_arrows[index].x + arrow_width) - pos_x;
        if (width > 0) {
            if (width > canvas.width) {
                width = canvas.width;
            }
            ctx.drawImage(canvas, 0, 0, width, canvas.height,
                                  pos_x, pos_y, width, canvas.height);
        }
    }
}

function draw_centered_blink(text, pos_y) {
    ctx.save();
        if (blink_val < 50) {
            ctx.globalAlpha = blink_val * 0.02;
        } else if (blink_val >= 75) {
            ctx.globalAlpha = (125 - blink_val) * 0.02;
        }
        status_font.draw_centered(ctx, text, pos_y);
    ctx.restore();
}

function draw() {
    switch (game_state) {
    case GameState.TITLE_SCREEN:
        ctx.drawImage(sky_image, 0, 0, canvas_width, canvas_height);

        draw_title_screen_line(0, throw_canvas, 60, 130);
        draw_title_screen_line(1, an_canvas, 150, 160);
        draw_title_screen_line(2, arrow_canvas, 200, 190);

        let status_text = '';
        if (title_screen_state == TitleScreenState.AFTER_INTRO) {
            status_text = used_touch ? 'Touch to play!' : 'Left click to play!';
            normal_font.draw_bottom_centered(ctx, 'Please visit https://github.com/hckr/throw-an-arrow\nfor information about the authors of used resources and the code');
        } else if (!is_fullscreen) {
            status_text = 'Click to enter fullscreen!';
        }
        draw_centered_blink(status_text, 20);

        bow.draw_on(ctx);

        for (let arrow of title_screen_arrows) {
            ctx.drawImage(arrow_image, arrow.x, arrow.y);
        }

        break;

    case GameState.LEVEL_INFO:
        ctx.drawImage(level.bg_image, 0, 0, canvas_width, canvas_height);
        bow.draw_on(ctx);
        big_font.draw_centered(ctx, `Level ${level_n}\n${level.title}`);
        normal_font.draw_bottom_centered(ctx, level.description);
        draw_centered_blink(used_touch ? 'Touch to start!' : 'Left click to start!', 50);
        break;

    case GameState.LEVEL_PLAY:
        ctx.drawImage(level.bg_image, 0, 0, canvas_width, canvas_height);
        bow.draw_on(ctx);
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

    case GameState.END_SCREEN:
        ctx.drawImage(sky_image, 0, 0, canvas_width, canvas_height);
        big_font.draw_centered(ctx, `Congratulations!\nYou finished the game`);
        normal_font.draw_bottom_centered(ctx, 'I hope you liked it.');
        draw_centered_blink(used_touch ? 'Touch to start again!' : 'Left click to start again!', 50);


    }

    if (game_state != GameState.TITLE_SCREEN) {
        status_font.draw(ctx, 5, 20, 'score');
        status_number_font.draw(ctx, 35, 20, score_to_str(score));
        status_font.draw(ctx, 11, 35, 'best');
        status_number_font.draw(ctx, 35, 35, score_to_str(localStorage['best_score']));

        if (game_state != GameState.END_SCREEN) {
            status_font.draw(ctx, canvas_width - 35, 20, 'arrows');
            ctx.fillStyle = '#e1d1ac';
            for (let pos_x = canvas_width - 42, arrows_drawn = 0; arrows_drawn < arrows_remaining; ++arrows_drawn, pos_x -= 3) {
                ctx.fillRect(pos_x, 12, 1, 8);
            }
        }
    }

    // if (debug) {
    //     status_font.draw(ctx, canvas_width - 70, 45, `used colors: ${check_colors_and_get_count()}`);
    // }

    requestAnimationFrame(draw);
}

function update() {
    blink_val += 1;
    if (blink_val >= 125) {
        blink_val = 0;
    }

    switch (game_state) {
    case GameState.LEVEL_PLAY:
        level.update(arrows);
        arrows = arrows.filter(arrow => {
            arrow.x += arrow.speed;
            return arrow.x < canvas_width && arrow.x > -arrow_width;
        });
        break;

    case GameState.TITLE_SCREEN:
        switch (title_screen_state) {
        case TitleScreenState.REVEALING_BOW:
            if (bow.pos_y < 142) {
                bow.pos_y += 2;
            } else {
                title_screen_state = TitleScreenState.FIRING_ARROW_1;
            }
            break;

        case TitleScreenState.FIRING_ARROW_1:
            bow.load_arrow();
            bow.strain();
            bow.release_arrow(arrow => {
                title_screen_state = TitleScreenState.BOW_TIMEOUT;
                title_screen_arrows.push(arrow);
                setTimeout(_ => {
                    title_screen_state = TitleScreenState.MOVING_BOW_1;
                }, 500);
            });
            break;

        case TitleScreenState.MOVING_BOW_1:
            if (bow.pos_y < 172) {
                bow.pos_y += 1;
            } else {
                title_screen_state = TitleScreenState.FIRING_ARROW_2;
            }
            break;

        case TitleScreenState.FIRING_ARROW_2:
            bow.load_arrow();
            bow.strain();
            bow.release_arrow(arrow => {
                title_screen_state = TitleScreenState.BOW_TIMEOUT;
                title_screen_arrows.push(arrow);
                setTimeout(_ => {
                    title_screen_state = TitleScreenState.MOVING_BOW_2;
                }, 500);
            });
            break;

        case TitleScreenState.MOVING_BOW_2:
            if (bow.pos_y < 202) {
                bow.pos_y += 1;
            } else {
                title_screen_state = TitleScreenState.FIRING_ARROW_3;
            }
            break;

        case TitleScreenState.FIRING_ARROW_3:
            bow.load_arrow();
            bow.strain();
            bow.release_arrow(arrow => {
                title_screen_state = TitleScreenState.BOW_TIMEOUT;
                title_screen_arrows.push(arrow);
                setTimeout(_ => {
                    title_screen_state = TitleScreenState.MOVING_BOW_3;
                }, 500);
            });
            break;

        case TitleScreenState.MOVING_BOW_3:
            if (bow.pos_y > 80) {
                bow.pos_y -= 1;
            } else {
                if (title_screen_arrows[2] && title_screen_arrows[2].x > canvas_width) {
                    title_screen_state = TitleScreenState.AFTER_INTRO;
                }
            }
            break;
        }
        for (let arrow of title_screen_arrows) {
            arrow.x += 2;
        }
        break;
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

update();
draw();
