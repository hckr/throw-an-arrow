// include_once{images.js}
// include_once{sounds.js}

function Level2(onlevelend) {
    this.bg_image = sky_image;
    this.arrows_limit = 25;
    this.balloons = [];
    let faster = true;
    for (let x = 0; x < 200; x += 15) {
        this.balloons.push({
            x: canvas_width - 20 - x,
            y: canvas_height + 150,
            speed: faster ? 3 : 2
        });
        faster = !faster;
    }
    this.onlevelend = onlevelend;
}

Level2.prototype.drawOn = function(ctx) {
    for (let balloon of this.balloons) {
        if (balloon.pierced) {
            ctx.drawImage(balloon_image, balloon_frame_width, 0, balloon_frame_width, balloon_frame_height, balloon.x, balloon.y, balloon_frame_width, balloon_frame_height);
        } else {
            ctx.drawImage(balloon_image, 0, 0, balloon_frame_width, balloon_frame_height, balloon.x, balloon.y, balloon_frame_width, balloon_frame_height);
        }
    }
}

Level2.prototype.update = function(arrows) {
    this.balloons = this.balloons.filter(balloon => {
        for (let arrow of arrows) {
            let y_dist = arrow.y - balloon.y,
                x_dist = arrow.x - balloon.x;
            if (!balloon.pierced &&
                y_dist > -arrow_height && y_dist < balloon_frame_height - 15 &&
                x_dist + arrow_width > -3 && x_dist + arrow_width < 3)
            {
                play(burst_sound);
                balloon.pierced = true;
                break;
            }
        }
        if (balloon.pierced) {
            balloon.y += 4;
        } else {
            balloon.y -= balloon.speed;
            if (balloon.y < -balloon_frame_height) {
                balloon.y += canvas_height + balloon_frame_height;
            }
        }
        return !(balloon.pierced && balloon.y > (canvas_height + balloon_frame_height));
    });
    if (this.balloons.length == 0) {
        onlevelend(true);
    }
}
