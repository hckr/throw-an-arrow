let mouse_down = false,
    mouse_down_y,
    mouse_down_bow_pos_y;

function mousedown(e) {
    if (!is_fullscreen) {
        return;
    }
    switch (e.which) {
    case 1:
        bow.strain();
        mouse_down = true;
        mouse_down_y = e.pageY;
        mouse_down_bow_pos_y = bow.pos_y;
        break;
    case 3:
        if (arrows_remaining && game_state == GameState.LEVEL_PLAY) {
            if (bow.load_arrow()) { // returns false if cannot load
                --arrows_remaining;
            }
        }
        break;
    }
}

function mouseup(e) {
    if (!is_fullscreen) {
        return;
    }
    if (e.which == 1) {
        bow.release_arrow(add_arrow);
        mouse_down = false;
    }
}

function mousemove(e, touch) {
    if (!is_fullscreen) {
        return;
    }
    if (game_state == GameState.LEVEL_PLAY && mouse_down) {
        if (e.movementY) {
            bow.move_y(e.movementY * canvas_height / canvas_real_height);
        } else {
            let diff = (e.pageY - mouse_down_y) * canvas_height / canvas_real_height;
            bow.set_y(mouse_down_bow_pos_y + diff * 1.5);
        }
    }
}

c.addEventListener('mousedown', mousedown);
c.addEventListener('mouseup', mouseup);
c.addEventListener('mousemove', mousemove);

document.addEventListener('touchstart', e => {
    mousedown({which: 3});
    mousedown({which: 1, pageY: e.touches[0].pageY});
});

document.addEventListener('touchend', e => {
    mouseup({which: 1});
});

document.addEventListener('touchmove', e => {
    mousemove({pageY: e.touches[0].pageY}, true);
});
