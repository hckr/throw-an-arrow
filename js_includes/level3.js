// include_once{images.js}
// include_once{sounds.js}

let VioletState = Object.freeze({
    INACTIVE: 1,
    HIDDEN: 2,
    HIDING: 3,
    SHOWING: 4,
    OTHER: 5
});

class Level3 {
    constructor(onlevelend) {
        this.bg_image = sky_image;
        this.arrows_limit = 50;
        this.onlevelend = onlevelend;
        this.violets = [];
        let inactive = [];
        for (let i = 0; i < 4; ++i) {
            this.violets.push({
                x: canvas_width - 100,
                y: 45 + i * 93,
                health: 10,
                state: VioletState.INACTIVE
            });
            inactive.push([i, Math.random()]);
        }
        this.inactive = inactive.sort((a, b) => a[1] < b[1]).map(a => a[0]);
        this.release_violet();
    }

    release_violet() {
        let id = this.inactive.pop();
        if (id != undefined) {
            this.violets[id].state = VioletState.HIDDEN;
        }
    }

    draw_on(ctx) {
        for (let violet of this.violets) {
            ctx.fillStyle = '#87238f';
            let pos_y = violet.y - 8;
            for (let pos_x = violet.x + 10, health_drawn = 0; health_drawn < violet.health; ++health_drawn, pos_x += 6) {
                ctx.fillRect(pos_x, pos_y, 5, 2);
            }
            ctx.drawImage(violet_image, violet_pos_x, violet_pos_y, violet_width, violet_height, violet.x, violet.y, violet_width, violet_height);
        }
    }

    update(arrows, bow) {
        let game_over = false;
        this.violets = this.violets.filter(violet => {
            if (violet.state == VioletState.SHOWING) {
                for (let arrow of arrows) {
                    let diff_y = (arrow.y + 2) - violet.y,
                        diff_x = (arrow.x + arrow_width) - violet.x;
                    if ((diff_y >= -2 && diff_y <= 1 && diff_x >= 34 && diff_x <= 37) ||
                        (diff_y >= 2 && diff_y <= 3 && diff_x >= 28 && diff_x <= 31) ||
                        (diff_y >= 4 && diff_y <= 5 && diff_x >= 26 && diff_x <= 29) ||
                        (diff_y >= 6 && diff_y <= 11 && diff_x >= 22 && diff_x <= 25) ||
                        (diff_y >= 12 && diff_y <= 13 && diff_x >= 8 && diff_x <= 11) ||
                        (diff_y >= 14 && diff_y <= 15 && diff_x >= 2 && diff_x <= 5) ||
                        (diff_y >= 16 && diff_y <= 29 && diff_x >= 0 && diff_x <= 3) ||
                        (diff_y >= 30 && diff_y <= 31 && diff_x >= 2 && diff_x <= 5) ||
                        (diff_y >= 32 && diff_y <= 33 && diff_x >= 4 && diff_x <= 7) ||
                        (diff_y >= 34 && diff_y <= 37 && diff_x >= 8 && diff_x <= 11) ||
                        (diff_y >= 38 && diff_y <= 51 && diff_x >= 6 && diff_x <= 9) ||
                        (diff_y >= 52 && diff_y <= 55 && diff_x >= 8 && diff_x <= 11) ||
                        (diff_y >= 56 && diff_y <= 57 && diff_x >= 10 && diff_x <= 13) ||
                        (diff_y >= 58 && diff_y <= 59 && diff_x >= 14 && diff_x <= 17) ||
                        (diff_y >= 60 && diff_y <= 61 && diff_x >= 44 && diff_x <= 47) ||
                        (diff_y >= 62 && diff_y <= 65 && diff_x >= 46 && diff_x <= 49))
                    {
                        play(air_hit_sound);
                        --violet.health;
                        violet.state = VioletState.HIDING;
                        this.release_violet();
                        break;
                    }
                }
            }
            switch(violet.state) {
            case VioletState.HIDDEN:
                violet.state = VioletState.OTHER;
                setTimeout(_ => {
                    violet.state = VioletState.SHOWING;
                }, 1000);
                break;
            case VioletState.SHOWING:
                violet.x -= 1;
                break;
            case VioletState.HIDING:
                if (violet.x < canvas_width) {
                    violet.x += 3;
                } else {
                    violet.state = VioletState.HIDDEN;
                }
                break;
            }
            if (violet.x <= -violet_width) {
                game_over = true;
            }
            return !(violet.health <= 0 && violet.state == VioletState.HIDDEN);
        });
        if (this.violets.length == 0) {
            onlevelend(true);
        } else if (game_over) {
            onlevelend(false)
        }
    }
}
