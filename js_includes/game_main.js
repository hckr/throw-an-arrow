let ctx = c.getContext('2d'),
    canvas_width = c.width,
    canvas_height = c.height;

ctx.fillStyle = '#008040';

let bowImage = new Image();
bowImage.src = '#datauri{image/png,assets/images/bow.png}';

let arrowImage = new Image();
arrowImage.src = '#datauri{image/png,assets/images/arrow.png}';

let frame = 0;

(function r(){
    ctx.fillRect(0, 0, canvas_width, canvas_height);
    ctx.drawImage(bowImage, (frame % 6) * 35, ((frame / 6) | 0) * 45, 35, 45, 0, 0, 35, 45);
    if (frame == 23) {
        ctx.drawImage(arrowImage, 0, 0, 22, 5, 0, 20, 22, 5);
    }
    requestAnimationFrame(r);
})();

function animate() {
    console.log(frame);
    setTimeout(_ => {
        if (++frame < 12) {
            animate();
        } else {
            frame = 23;
        }
    }, 50);
}

c.addEventListener('click', e => {
    frame = 0;
    animate();
});
