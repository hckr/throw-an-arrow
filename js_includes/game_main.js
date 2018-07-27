let ctx = c.getContext('2d'),
    canvas_width = c.width,
    canvas_height = c.height;

let canvas_real_height;
function compute_canvas_height() {
    canvas_real_height = parseInt(getComputedStyle(c, null).getPropertyValue('height'));
}
addEventListener('resize', compute_canvas_height);

let bow_image = new Image();
bow_image.src = '#datauri{image/png,assets/images/bow.png}';
let bow_frame_width = 35,
    bow_frame_height = 45;

let arrow_image = new Image();
arrow_image.src = '#datauri{image/png,assets/images/arrow.png}';
let arrow_width = 22,
    arrow_height = 5;

let balloon_image = new Image();
balloon_image.src = '#datauri{image/png,assets/images/balloon.png}';
let balloon_frame_width = 10,
    balloon_frame_height = 40;

let bow_pos_y = 30,
    bow_pos_y_min = 0,
    bow_pos_y_max = canvas_height - bow_frame_height;

let arrows = [];
let balloons = [];

let is_loaded = false,
    can_be_loaded = true;

let frame = 0;

(function draw() {
    ctx.fillStyle = '#33f';
    ctx.fillRect(0, 0, canvas_width, canvas_height);
    ctx.drawImage(bow_image, (frame % 6) * bow_frame_width, ((frame / 6) | 0) * bow_frame_height, bow_frame_width, bow_frame_height,
                  0, bow_pos_y, bow_frame_width, bow_frame_height);
    if (is_loaded) {
        ctx.drawImage(arrow_image, 0, bow_pos_y + 20);
    }
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

function load_arrow() {
    setTimeout(_ => {
        if (++frame < 12) {
            load_arrow();
        } else {
            is_loaded = true;
            can_be_loaded = false;
            frame = 23;
        }
    }, 50);
}

function throw_arrow() {
    arrows.push({
        x: 0,
        y: bow_pos_y + 20
    });
    is_loaded = false;
    (function restore_chord() {
        setTimeout(_ => {
            if (--frame > 12) {
                restore_chord();
            } else {
                can_be_loaded = true;
                frame = 0;
            }
        }, 10);
    })();
}

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
    setTimeout(update, 30);
})();

c.addEventListener('contextmenu', e => {
    e.preventDefault();
});

let mouse_down = false;

c.addEventListener('mousedown', e => {
    mouse_down = true;

    if (e.which == 3 && can_be_loaded) {
        load_arrow();
    }
});

c.addEventListener('mouseup', e => {
    mouse_down = false;

    if (e.which == 1 && is_loaded) {
        throw_arrow();
    }
});

c.addEventListener('mousemove', e => {
    if (mouse_down) {
        bow_pos_y += e.movementY * canvas_height / canvas_real_height;
        bow_pos_y |= 0;
        if (bow_pos_y < bow_pos_y_min) {
            bow_pos_y = bow_pos_y_min;
        } else if (bow_pos_y > bow_pos_y_max) {
            bow_pos_y = bow_pos_y_max;
        }
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
