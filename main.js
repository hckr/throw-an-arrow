document.body.innerHTML = `<canvas id=c width=360 height=400 style=position:absolute;top:0;left:0;width:100%;height:100%;image-rendering:pixelated></canvas>`;

// include_once{background_music.js}
// include_once{game_main.js}

c.addEventListener('mousedown', e => c.webkitRequestFullscreen());
