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
