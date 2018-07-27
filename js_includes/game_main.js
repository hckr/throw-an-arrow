let ctx = c.getContext('2d'),
    canvas_width = c.width,
    canvas_height = c.height;

let canvas_real_height;
function compute_canvas_height() {
    canvas_real_height = parseInt(getComputedStyle(c, null).getPropertyValue('height'));
}
addEventListener('resize', compute_canvas_height);

ctx.fillStyle = '#008040';

let bow_image = new Image();
bow_image.src = '#datauri{image/png,assets/images/bow.png}';
let bow_frame_width = 35,
    bow_frame_height = 45;

let arrow_image = new Image();
arrow_image.src = '#datauri{image/png,assets/images/arrow.png}';
let arrow_width = 22,
    arrow_height = 5;

let bow_pos_y = 30;

let arrows = [];

let is_loaded = false,
    can_be_loaded = true;

let frame = 0;

(function draw(){
    ctx.fillRect(0, 0, canvas_width, canvas_height);
    ctx.drawImage(bow_image, (frame % 6) * bow_frame_width, ((frame / 6) | 0) * bow_frame_height, bow_frame_width, bow_frame_height,
                  0, bow_pos_y, bow_frame_width, bow_frame_height);
    if (is_loaded) {
        ctx.drawImage(arrow_image, 0, 0, arrow_width, arrow_height, 0, bow_pos_y + 20, arrow_width, arrow_height);
    }
    for (let arrow of arrows) {
        console.log(arrow);
        ctx.drawImage(arrow_image, 0, 0, arrow_width, arrow_height, arrow.x, arrow.y, arrow_width, arrow_height);
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
        }, 20);
    })();
}

(function update() {
    arrows = arrows.filter(arrow => {
        arrow.x += 5;
        return arrow.x < canvas_width;
    });
    setTimeout(update, 50);
})();

c.addEventListener('contextmenu', e => {
    e.preventDefault();
});

let mouse_down = false,
    mouse_down_pos_y,
    old_bow_pos_y;

c.addEventListener('mousedown', e => {
    mouse_down = true;
    mouse_down_pos_y = e.offsetY;
    old_bow_pos_y = bow_pos_y;

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
        console.log(canvas_height / canvas_real_height);
        bow_pos_y = old_bow_pos_y + (e.offsetY - mouse_down_pos_y) * canvas_height / canvas_real_height;
    }
});
