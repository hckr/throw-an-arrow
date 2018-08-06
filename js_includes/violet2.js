// include_once{violet_level_base.js}

class Violet2 extends VioletLevelBase {
    constructor(onlevelend) {
        super(onlevelend, 55);
        this.minions = [];
        setTimeout(_ => this.release_minion(true), 1500);

        this.title = 'Even worse weather';
        this.description =
`The clouds are not giving up!
Now they can shoot something which
is stopping your arrows
and can damage your bow!
Just let it fly away, don't waste arrows.`;
    }

    release_minion(timeout) {
        let ready_violets = this.violets.filter(violet => violet.state == VioletState.SHOWING && violet.x > 200);
        if (ready_violets.length == 0) {
            setTimeout(_ => this.release_minion(timeout), 100);
            return;
        }
        let violet = ready_violets[(Math.random() * ready_violets.length) | 0];
        this.minions.push({
            x: violet.x + 40,
            y: violet.y + Math.random() * 52,
            frame: 0
        });
        if (timeout) {
            setTimeout(_ => this.release_minion(true), 4000);
        }
    }

    draw_on(ctx) {
        for (let minion of this.minions) {
            ctx.drawImage(violet_image, violet_minion_pos_x, violet_minion_pos_y,
                          violet_minion_width, violet_minion_height, minion.x, minion.y,
                          violet_minion_width, violet_minion_height);
        }
        super.draw_on(ctx);
    }

    update(arrows) {
        this.minions = this.minions.filter(minion => {
            minion.x -= 1.5;
            let bow_diff_y = minion.y - bow.pos_y;
            if (minion.x < bow_frame_width / 2 && bow_diff_y < bow_frame_height && bow_diff_y > -violet_minion_height) {
                this.game_over = true;
            }
            for (let arrow of arrows) {
                if (arrow.speed > 0) {
                    let diff_y = arrow.y - minion.y,
                        diff_x = (arrow.x + arrow_width) - minion.x;
                    if (diff_y >= 0 && diff_y <= violet_minion_height - 2 && diff_x >= 2 && diff_x <= 6) {
                        play(air_hit_sound);
                        arrow.speed = -1.5;
                    }
                }
            }
            return minion.x > -violet_minion_width;
        });
        super.update(arrows);
    }
}
