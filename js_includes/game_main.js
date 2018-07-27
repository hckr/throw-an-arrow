// include_once{bow.js}
// include_once{images.js}
// include_once{levels.js}

let bow = new Bow(30);

// include_once{bow_events.js}

let arrow_width = 22,
    arrow_height = 5;

let arrows = [];

let level;

function onlevelend(success) {
    level = construct_first_level(onlevelend);
}

function draw() {
    ctx.fillStyle = '#33f';
    ctx.fillRect(0, 0, canvas_width, canvas_height);
    bow.drawOn(ctx);
    for (let arrow of arrows) {
        ctx.drawImage(arrow_image, arrow.x, arrow.y);
    }
    level.drawOn(ctx);
    requestAnimationFrame(draw);
}

function update() {
    level.update(arrows);
    arrows = arrows.filter(arrow => {
        arrow.x += 3;
        return arrow.x < canvas_width;
    });
    setTimeout(update, 20);
}

onlevelend();
console.log(level);
update();
draw();
