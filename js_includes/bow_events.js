let mouse_down = false;

c.addEventListener('mousedown', e => {
    switch (e.which) {
    case 1:
        bow.strain();
        mouse_down = true;
        break;
    case 3:
        if (arrows_remaining) {
            if (bow.load_arrow()) { // returns false if cannot load
                --arrows_remaining;
            }
        }
        break;
    }
});

c.addEventListener('mouseup', e => {
    if (e.which == 1) {
        bow.release_arrow(add_arrow);
        mouse_down = false;
    }
});

c.addEventListener('mousemove', e => {
    if (mouse_down) {
        bow.move_y(e.movementY * canvas_height / canvas_real_height);
    }
});
