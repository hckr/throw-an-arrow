document.body.innerHTML = `<canvas id=c width=360 height=400 style=position:absolute;top:0;left:0;width:100%;height:100%;image-rendering:pixelated></canvas>`;

c.addEventListener('mousedown', e => {
    c.webkitRequestFullscreen();
    c.requestPointerLock();
});

let ctx = c.getContext('2d'),
    canvas_width = c.width,
    canvas_height = c.height;

let canvas_real_height;
function compute_canvas_height() {
    canvas_real_height = parseInt(getComputedStyle(c, null).getPropertyValue('height'));
}
addEventListener('resize', compute_canvas_height);
