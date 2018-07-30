// include_once{images.js}
// include_once{sounds.js}

class Level3 {
    constructor(onlevelend) {
        this.bg_image = sky_image;
        this.arrows_limit = 30;
        this.onlevelend = onlevelend;
        this.violets = [];
        this.violets.push({
            x: canvas_width - violet_width - 20,
            y: (Math.random() * (canvas_height - violet_height - 30) + 30) | 0,
            health: 10
        });
    }

    draw_on(ctx) {
        for (let violet of this.violets) {
            ctx.fillStyle = '#87238f';
            let pos_y = violet.y - 12;
            for (let pos_x = violet.x + 10, health_drawn = 0; health_drawn < violet.health; ++health_drawn, pos_x += 6) {
                ctx.fillRect(pos_x, pos_y, 6, 3);
            }
            ctx.drawImage(violet_image, violet_pos_x, violet_pos_y, violet_width, violet_height, violet.x, violet.y, violet_width, violet_height);
        }
    }

    update(arrows) {
        this.violets = this.violets.filter(violet => {
            for (let arrow of arrows) {
                let diff_y = (arrow.y + 2) - violet.y,
                    diff_x = (arrow.x + arrow_width) - violet.x;
                if ((diff_y >= -2 && diff_y <= 1 && diff_x >= 34 && diff_x <= 36) ||
                    (diff_y >= 2 && diff_y <= 3 && diff_x >= 28 && diff_x <= 30) ||
                    (diff_y >= 4 && diff_y <= 5 && diff_x >= 26 && diff_x <= 28) ||
                    (diff_y >= 6 && diff_y <= 11 && diff_x >= 22 && diff_x <= 24) ||
                    (diff_y >= 12 && diff_y <= 13 && diff_x >= 8 && diff_x <= 10) ||
                    (diff_y >= 14 && diff_y <= 15 && diff_x >= 2 && diff_x <= 4) ||
                    (diff_y >= 16 && diff_y <= 29 && diff_x >= 0 && diff_x <= 2) ||
                    (diff_y >= 30 && diff_y <= 31 && diff_x >= 2 && diff_x <= 4) ||
                    (diff_y >= 32 && diff_y <= 33 && diff_x >= 4 && diff_x <= 6) ||
                    (diff_y >= 34 && diff_y <= 37 && diff_x >= 8 && diff_x <= 10) ||
                    (diff_y >= 38 && diff_y <= 51 && diff_x >= 6 && diff_x <= 8) ||
                    (diff_y >= 52 && diff_y <= 55 && diff_x >= 8 && diff_x <= 10) ||
                    (diff_y >= 56 && diff_y <= 57 && diff_x >= 10 && diff_x <= 12) ||
                    (diff_y >= 58 && diff_y <= 59 && diff_x >= 14 && diff_x <= 16) ||
                    (diff_y >= 60 && diff_y <= 61 && diff_x >= 44 && diff_x <= 46) ||
                    (diff_y >= 62 && diff_y <= 65 && diff_x >= 46 && diff_x <= 48))
                {
                    play(air_hit_sound);
                    --violet.health;
                    break;
                }
            }
            return !(violet.to_be_removed && violet.x > canvas_width);
        });
        if (this.violets.length == 0) {
            onlevelend(true);
        }
    }
}
