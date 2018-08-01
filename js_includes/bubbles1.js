// include_once{images.js}
// include_once{sounds.js}

class Bubbles1 {
    constructor(onlevelend) {
        this.arrows_limit = 12;
        this.bubbles = [];
        this.butterflies = [];
        this.onlevelend = onlevelend;

        let odd = true;
        for (let x = 0; x < 240; x += 24) {
            this.bubbles.push({
                x: canvas_width - 20 - x,
                y: odd ? 0 : canvas_height - bubble_frame_height,
                speed: -2,
                frame: 0
            });
            odd = !odd;
        }

        this.bg_image = sky_image;
    }

    draw_on(ctx) {
        for (let bubble of this.bubbles) {
            ctx.drawImage(bubble_image, bubble_frame_width * bubble.frame, 0, bubble_frame_width, bubble_frame_height, bubble.x, bubble.y, bubble_frame_width, bubble_frame_height);
        }
        for (let butterfly of this.butterflies) {
            ctx.drawImage(butterfly_image, butterfly_frame_width * butterfly.frame, 0, butterfly_frame_width, butterfly_frame_height, butterfly.x, butterfly.y, butterfly_frame_width, butterfly_frame_height);
        }
    }

    update(arrows) {
        this.bubbles = this.bubbles.filter(bubble => {
            for (let arrow of arrows) {
                let diff_y = (arrow.y + 2) - bubble.y,
                    diff_x = (arrow.x + arrow_width) - bubble.x;
                if (!bubble.pierced &&
                    (diff_y >= 0 && diff_y <= 7 && diff_x >= 4 && diff_x <= 6) ||
                    (diff_y >= 8 && diff_y <= 11 && diff_x >= 2 && diff_x <= 4) ||
                    (diff_y >= 12 && diff_y <= 23 && diff_x >= 0 && diff_x <= 2) ||
                    (diff_y >= 24 && diff_y <= 27 && diff_x >= 2 && diff_x <= 4) ||
                    (diff_y >= 28 && diff_y <= 31 && diff_x >= 4 && diff_x <= 6) ||
                    (diff_y >= 32 && diff_y <= 42 && diff_x >= 6 && diff_x <= 8))
                {
                    play(air_hit_sound);
                    bubble.pierced = true;
                    this.butterflies.push({
                        x: bubble.x - 1,
                        y: bubble.y + 12,
                        frame: 0
                    });
                    break;
                }
            }
            if (bubble.pierced) {
                ++bubble.frame;
            } else {
                bubble.y -= bubble.speed;
                if (bubble.y <= -4 || bubble.y > canvas_height - bubble_frame_height + 4)
                {
                    bubble.speed = -bubble.speed;
                }
            }
            return !(bubble.pierced && bubble.frame >= 9);
        });
        this.butterflies = this.butterflies.filter(butterfly => {
            butterfly.x -= 1;
            butterfly.y -= 1;
            butterfly.frame = (butterfly.frame + 1) % 8;
            return butterfly.y > -butterfly_frame_height;
        });
        if (this.bubbles.length == 0 && this.butterflies.length == 0) {
            onlevelend(true);
        }
    }
}
