function Level2(onlevelend) {
    this.background_color = '#33f';
    this.arrows_limit = 20;
    this.balloons = [];
    let modifier = 100;
    for (let x = 0; x < 200; x += 15) {
        this.balloons.push({
            x: canvas_width - 20 - x,
            y: canvas_height + Math.abs(x - modifier),
            speed: Math.random() > 0.5 ? 2 : 3
        });
        modifier += 15;
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
                y_dist > -3 && y_dist < balloon_frame_height - 15 &&
                x_dist + arrow_width > -3 && x_dist + arrow_width < 3)
            {
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
