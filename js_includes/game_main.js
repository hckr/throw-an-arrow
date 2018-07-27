// include_once{bow.js}
// include_once{images.js}

let arrow_width = 22,
    arrow_height = 5;

let balloon_frame_width = 10,
    balloon_frame_height = 40;

let bow = new Bow(30);

let arrows = [];
let balloons = [];

let is_loaded = false,
    can_be_loaded = true;

let frame = 0;

(function draw() {
    ctx.fillStyle = '#33f';
    ctx.fillRect(0, 0, canvas_width, canvas_height);
    bow.drawOn(ctx);
    for (let arrow of arrows) {
        ctx.drawImage(arrow_image, arrow.x, arrow.y);
    }
    for (let balloon of balloons) {
        if (balloon.pierced) {
            ctx.drawImage(balloon_image, balloon_frame_width, 0, balloon_frame_width, balloon_frame_height, balloon.x, balloon.y, balloon_frame_width, balloon_frame_height);
        } else {
            ctx.drawImage(balloon_image, 0, 0, balloon_frame_width, balloon_frame_height, balloon.x, balloon.y, balloon_frame_width, balloon_frame_height);
        }
    }
    requestAnimationFrame(draw);
})();

(function update() {
    balloons.filter(balloon => {
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
            balloon.y -= 2;
            if (balloon.y < -balloon_frame_height) {
                balloon.y += canvas_height + balloon_frame_height;
            }
        }
        return !(balloon.pierced && balloon.y > (canvas_height + balloon_frame_height));
    });
    arrows = arrows.filter(arrow => {
        arrow.x += 3;
        return arrow.x < canvas_width;
    });
    setTimeout(update, 20);
})();

c.addEventListener('contextmenu', e => {
    e.preventDefault();
});

let mouse_down = false;

c.addEventListener('mousedown', e => {
    mouse_down = true;

    switch (e.which) {
    case 1:
        bow.strain();
        break;
    case 3:
        bow.load_arrow();
        break;
    }
});

c.addEventListener('mouseup', e => {
    mouse_down = false;

    if (e.which == 1) {
        bow.release_arrow(arrow => arrows.push(arrow));
    }
});

c.addEventListener('mousemove', e => {
    if (mouse_down) {
        bow.move_y(e.movementY * canvas_height / canvas_real_height);
    }
});

function create_balloon(x) {
    balloons.push({
        x: x,
        y: canvas_height
    });
}

for (let x = 0; x < 200; x += 12) {
    create_balloon(canvas_width - 20 - x)
}
