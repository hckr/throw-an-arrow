document.body.innerHTML = `<canvas id=c width=360 height=400 style=position:absolute;top:0;left:0;width:100%;height:100%;image-rendering:-moz-crisp-edges;image-rendering:pixelated></canvas>`;

let is_fullscreen = false;

function mousedown2() {
    (c.requestFullscreen || c.webkitRequestFullscreen || c.mozRequestFullScreen).call(document.body);
    (c.requestPointerLock || c.mozRequestPointerLock).call(c);
    unmuteBackgroundMusic();
}

c.addEventListener('click', mousedown2);

document.onwebkitfullscreenchange = document.onmozfullscreenchange = e => {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
        is_fullscreen = true;
    } else {
        is_fullscreen = false;
    }
}

let ctx = c.getContext('2d'),
    canvas_width = c.width,
    canvas_height = c.height;

ctx.imageSmoothingEnabled = false;

let canvas_real_height;
function compute_canvas_height() {
    canvas_real_height = parseInt(getComputedStyle(c, null).getPropertyValue('height'));
}
addEventListener('resize', compute_canvas_height);

c.addEventListener('contextmenu', e => {
    e.preventDefault();
    return false;
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// debug code below (plus in draw function!)

// let debug = false;
//
// document.addEventListener('keydown', e => {
//     switch(e.key) {
//     case 'd':
//         debug = !debug;
//         break;
//     case 'n':
//         arrows_remaining = 0;
//         onlevelend(true);
//         break;
//     case 'q':
//         if (level_n == 3) {
//             level.butterflies.push({
//                 x: canvas_width - 30 - 1,
//                 y: canvas_height - bubble_frame_height + 12,
//                 frame: 0
//             });
//         }
//         break;
//     }
// });
//
// // let hex_colors = {};
// //
// // function to_hex_color(r, g, b) {
// //     let key = [r,g,b].toString(),
// //         ans = hex_colors[key];
// //     if (ans) {
// //         return ans;
// //     }
// //     for (let arg of arguments) {
// //         let str = arg.toString(16);
// //         if (str.length == 1) {
// //             ans += '0';
// //         }
// //         ans += str;
// //     }
// //     hex_colors[key] = ans;
// //     return ans;
// // }
//
// function check_colors_and_get_count() {
//     let data = ctx.getImageData(0, 0, canvas_width, canvas_height).data,
//         colors = new Set();
//     for (let i = 0; i < data.length; i += 4) {
//         let r = data[i],
//             g = data[i+1],
//             b = data[i+2],
//             a = data[i+3];
//         if (a != 255) {
//             throw 'Found a transparent pixel!';
//         }
//         colors.add([r, g, b].toString());
//     }
//     return colors.size;
// }
