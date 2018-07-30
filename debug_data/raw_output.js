document.body.innerHTML = `<canvas id=c width=360 height=400 style=position:absolute;top:0;left:0;width:100%;height:100%;image-rendering:pixelated></canvas>`;

c.addEventListener('mousedown', e => {
    c.webkitRequestFullscreen();
    c.requestPointerLock();
    unmuteBackgroundMusic();
});

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
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// debug code below (plus in draw function!)

let debug = false;

document.addEventListener('keydown', e => {
    if (e.key == 'd') {
        debug = !debug;
    }
});

// let hex_colors = {};
//
// function to_hex_color(r, g, b) {
//     let key = [r,g,b].toString(),
//         ans = hex_colors[key];
//     if (ans) {
//         return ans;
//     }
//     for (let arg of arguments) {
//         let str = arg.toString(16);
//         if (str.length == 1) {
//             ans += '0';
//         }
//         ans += str;
//     }
//     hex_colors[key] = ans;
//     return ans;
// }

function check_colors_and_get_count() {
    let data = ctx.getImageData(0, 0, canvas_width, canvas_height).data,
        colors = new Set();
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i],
            g = data[i+1],
            b = data[i+2],
            a = data[i+3];
        if (a != 255) {
            throw 'Found a transparent pixel!';
        }
        colors.add([r, g, b].toString());
    }
    let count = colors.size;
    if (count > 32) {
        throw 'More than 32 colors on canvas!';
    }
    return count;
}

let audioCtx = new AudioContext(),
    source = audioCtx.createBufferSource(),
    byteString = atob('T2dnUwACAAAAAAAAAADNvMJhAAAAAEsBGv0BHgF2b3JiaXMAAAAAAbgLAAAAAAAA/////wAAAACZAU9nZ1MAAAAAAAAAAAAAzbzCYQEAAACN9vNuCzz///////////+1A3ZvcmJpcywAAABYaXBoLk9yZyBsaWJWb3JiaXMgSSAyMDE1MDEwNSAo4puE4puE4puE4puEKQAAAAABBXZvcmJpcxJCQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBADIAAAYhiGH3knMkFOQSSYpVcw5CKH1DjnlFGTSUsaYYoxRzpBTDDEFMYbQKYUQ1E45pQwiCENInWTOIEs96OBi5zgQGrIiAIgCAACMQYwhxpBzDEoGIXKOScggRM45KZ2UTEoorbSWSQktldYi55yUTkompbQWUsuklNZCKwUAAAQ4AAAEWAiFhqwIAKIAABCDkFJIKcSUYk4xh5RSjinHkFLMOcWYcowx6CBUzDHIHIRIKcUYc0455iBkDCrmHIQMMgEAAAEOAAABFkKhISsCgDgBAIMkaZqlaaJoaZooeqaoqqIoqqrleabpmaaqeqKpqqaquq6pqq5seZ5peqaoqp4pqqqpqq5rqqrriqpqy6ar2rbpqrbsyrJuu7Ks256qyrapurJuqq5tu7Js664s27rkearqmabreqbpuqrr2rLqurLtmabriqor26bryrLryratyrKua6bpuqKr2q6purLtyq5tu7Ks+6br6rbqyrquyrLu27au+7KtC7vourauyq6uq7Ks67It67Zs20LJ81TVM03X9UzTdVXXtW3VdW1bM03XNV1XlkXVdWXVlXVddWVb90zTdU1XlWXTVWVZlWXddmVXl0XXtW1Vln1ddWVfl23d92VZ133TdXVblWXbV2VZ92Vd94VZt33dU1VbN11X103X1X1b131htm3fF11X11XZ1oVVlnXf1n1lmHWdMLqurqu27OuqLOu+ruvGMOu6MKy6bfyurQvDq+vGseu+rty+j2rbvvDqtjG8um4cu7Abv+37xrGpqm2brqvrpivrumzrvm/runGMrqvrqiz7uurKvm/ruvDrvi8Mo+vquirLurDasq/Lui4Mu64bw2rbwu7aunDMsi4Mt+8rx68LQ9W2heHVdaOr28ZvC8PSN3a+AACAAQcAgAATykChISsCgDgBAAYhCBVjECrGIIQQUgohpFQxBiFjDkrGHJQQSkkhlNIqxiBkjknIHJMQSmiplNBKKKWlUEpLoZTWUmotptRaDKG0FEpprZTSWmopttRSbBVjEDLnpGSOSSiltFZKaSlzTErGoKQOQiqlpNJKSa1lzknJoKPSOUippNJSSam1UEproZTWSkqxpdJKba3FGkppLaTSWkmptdRSba21WiPGIGSMQcmck1JKSamU0lrmnJQOOiqZg5JKKamVklKsmJPSQSglg4xKSaW1kkoroZTWSkqxhVJaa63VmFJLNZSSWkmpxVBKa621GlMrNYVQUgultBZKaa21VmtqLbZQQmuhpBZLKjG1FmNtrcUYSmmtpBJbKanFFluNrbVYU0s1lpJibK3V2EotOdZaa0ot1tJSjK21mFtMucVYaw0ltBZKaa2U0lpKrcXWWq2hlNZKKrGVklpsrdXYWow1lNJiKSm1kEpsrbVYW2w1ppZibLHVWFKLMcZYc0u11ZRai621WEsrNcYYa2415VIAAMCAAwBAgAlloNCQlQBAFAAAYAxjjEFoFHLMOSmNUs45JyVzDkIIKWXOQQghpc45CKW01DkHoZSUQikppRRbKCWl1losAACgwAEAIMAGTYnFAQoNWQkARAEAIMYoxRiExiClGIPQGKMUYxAqpRhzDkKlFGPOQcgYc85BKRljzkEnJYQQQimlhBBCKKWUAgAAChwAAAJs0JRYHKDQkBUBQBQAAGAMYgwxhiB0UjopEYRMSielkRJaCylllkqKJcbMWomtxNhICa2F1jJrJcbSYkatxFhiKgAA7MABAOzAQig0ZCUAkAcAQBijFGPOOWcQYsw5CCE0CDHmHIQQKsaccw5CCBVjzjkHIYTOOecghBBC55xzEEIIoYMQQgillNJBCCGEUkrpIIQQQimldBBCCKGUUgoAACpwAAAIsFFkc4KRoEJDVgIAeQAAgDFKOSclpUYpxiCkFFujFGMQUmqtYgxCSq3FWDEGIaXWYuwgpNRajLV2EFJqLcZaQ0qtxVhrziGl1mKsNdfUWoy15tx7ai3GWnPOuQAA3AUHALADG0U2JxgJKjRkJQCQBwBAIKQUY4w5h5RijDHnnENKMcaYc84pxhhzzjnnFGOMOeecc4wx55xzzjnGmHPOOeecc84556CDkDnnnHPQQeicc845CCF0zjnnHIQQCgAAKnAAAAiwUWRzgpGgQkNWAgDhAACAMZRSSimllFJKqKOUUkoppZRSAiGllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimVUkoppZRSSimllFJKKaUAIN8KBwD/BxtnWEk6KxwNLjRkJQAQDgAAGMMYhIw5JyWlhjEIpXROSkklNYxBKKVzElJKKYPQWmqlpNJSShmElGILIZWUWgqltFZrKam1lFIoKcUaS0qppdYy5ySkklpLrbaYOQelpNZaaq3FEEJKsbXWUmuxdVJSSa211lptLaSUWmstxtZibCWlllprqcXWWkyptRZbSy3G1mJLrcXYYosxxhoLAOBucACASLBxhpWks8LR4EJDVgIAIQEABDJKOeecgxBCCCFSijHnoIMQQgghREox5pyDEEIIIYSMMecghBBCCKGUkDHmHIQQQgghhFI65yCEUEoJpZRSSucchBBCCKWUUkoJIYQQQiillFJKKSGEEEoppZRSSiklhBBCKKWUUkoppYQQQiillFJKKaWUEEIopZRSSimllBJCCKGUUkoppZRSQgillFJKKaWUUkooIYRSSimllFJKCSWUUkoppZRSSikhlFJKKaWUUkoppQAAgAMHAIAAI+gko8oibDThwgMQAAAAAgACTACBAYKCUQgChBEIAAAAAAAIAPgAAEgKgIiIaOYMDhASFBYYGhweICIkAAAAAAAAAAAAAAAABE9nZ1MABL9FAAAAAAAAzbzCYQIAAABa6kDhRzspKjEuLDUrLS4qKzUwMDErNzg1Pi8tOjAyNS0wOi0rOSsqOCwpMyQm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'),
    ia = new Uint8Array(byteString.length),
    gainNode = audioCtx.createGain();

for (let i = 0; i < byteString.length; ++i) {
    ia[i] = byteString.charCodeAt(i);
}

gainNode.connect(audioCtx.destination);

audioCtx.decodeAudioData(ia.buffer, function(buffer) {
   source.buffer = buffer;
   source.connect(gainNode);
   source.loop = true;
   source.start(0);
});

function muteBackgroundMusic() {
    gainNode.gain.setValueAtTime(0, 0);
}

function unmuteBackgroundMusic() {
    gainNode.gain.setValueAtTime(1, 0);
}



let BowState = Object.freeze({
    UNLOADED: 1,
    LOADED: 2,
    STRAINED: 3,
    OTHER: 4
});

function Bow(pos_y) {
    this.frame = 0;
    this.state = BowState.UNLOADED;
    this.pos_y = pos_y,
    this.pos_y_min = 0,
    this.pos_y_max = canvas_height - bow_frame_height;
    this.strain_promise = null;
}

Bow.prototype.load_arrow = function() {
    if (this.state == BowState.UNLOADED) {
        this.frame = 1;
        this.state = BowState.LOADED;
        return true;
    }
    return false;
}

Bow.prototype.strain = function() {
    if (this.state != BowState.LOADED)
        return;
    this.state = BowState.OTHER;
    this.strain_promise = new Promise((resolve, reject) => {
        let that = this;
        (function strain() {
            setTimeout(_ => {
                if (++that.frame < 11) {
                    strain();
                } else {
                    this.state = BowState.STRAINED;
                    resolve();
                }
            }, 30);
        })();
    });
}

Bow.prototype.release_arrow = function(add_arrow) {
    if (!this.strain_promise)
        return;
    let promise = this.strain_promise;
    this.strain_promise = null;
    promise.then(_ => {
        this.frame = 23;
        add_arrow({
            x: 0,
            y: this.pos_y + 20
        });
        let that = this;
        (function restore_chord() {
            setTimeout(_ => {
                if (--that.frame > 12) {
                    restore_chord();
                } else {
                    frame = 0;
                    that.state = BowState.UNLOADED;
                }
            }, 10);
        })();
    });
}

Bow.prototype.move_y = function(diff) {
    this.pos_y += diff
    this.pos_y |= 0;
    if (this.pos_y < this.pos_y_min) {
        this.pos_y = this.pos_y_min;
    } else if (this.pos_y > this.pos_y_max) {
        this.pos_y = this.pos_y_max;
    }
}

Bow.prototype.drawOn = function(ctx) {
    ctx.drawImage(bow_image, (this.frame % 6) * bow_frame_width, ((this.frame / 6) | 0) * bow_frame_height, bow_frame_width, bow_frame_height,
                  0, this.pos_y, bow_frame_width, bow_frame_height);

    if (this.state == BowState.STRAINED) {
        console.log('test');
        ctx.drawImage(arrow_image, 0, this.pos_y + 20);
    }
}

let bow_image = new Image();
bow_image.src = 'data:image/png;base64,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';
let bow_frame_width = 35,
    bow_frame_height = 45;

let arrow_image = new Image();
arrow_image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAFBAMAAACz2AE9AAAAElBMVEVjb2yzekHAhkmVlaLh0azs3LchNeVpAAAAAXRSTlMAQObYZgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAwSURBVAjXYwh1ZQABZmMg4RqqJCgoKGxsbGzA4OKiKKSkCGIbA9kgJSA2AwyA1AMAyOkF497zJPwAAAAASUVORK5CYII=';
let arrow_width = 22,
    arrow_height = 5;

let balloon_image = new Image();
balloon_image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAoAgMAAACDXzJIAAAACVBMVEUAAGcAAAD/AABz6q9GAAAAAXRSTlMAQObYZgAAAFJJREFUCNdjYFjAAARMK0Ak1yoEqbWqAY1ctWoBMsnUACK5ICQDErsBIYtMAsWB5qCQYLvgJNANTECjA8CkAAMjVjKAgRVIOjCwwEmICDEqQSQADn4qw55gBtoAAAAASUVORK5CYII=';
let balloon_frame_width = 10,
balloon_frame_height = 40;

let sky_image = new Image();
sky_image.src = 'data:image/png;base64,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';

function Level1(onlevelend) {
    this.bg_image = sky_image;
    this.arrows_limit = 18;
    this.balloons = [];
    for (let x = 0; x < 200; x += 12) {
        this.balloons.push({
            x: canvas_width - 20 - x,
            y: canvas_height
        });
    }
    this.onlevelend = onlevelend;
}

Level1.prototype.drawOn = function(ctx) {
    for (let balloon of this.balloons) {
        if (balloon.pierced) {
            ctx.drawImage(balloon_image, balloon_frame_width, 0, balloon_frame_width, balloon_frame_height, balloon.x, balloon.y, balloon_frame_width, balloon_frame_height);
        } else {
            ctx.drawImage(balloon_image, 0, 0, balloon_frame_width, balloon_frame_height, balloon.x, balloon.y, balloon_frame_width, balloon_frame_height);
        }
    }
}

Level1.prototype.update = function(arrows) {
    this.balloons = this.balloons.filter(balloon => {
        for (let arrow of arrows) {
            let y_dist = arrow.y - balloon.y,
                x_dist = arrow.x - balloon.x;
            if (!balloon.pierced &&
                y_dist > -arrow_height && y_dist < balloon_frame_height - 15 &&
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
    if (this.balloons.length == 0) {
        onlevelend(true);
    }
}

function Level2(onlevelend) {
    this.bg_image = sky_image;
    this.arrows_limit = 25;
    this.balloons = [];
    let faster = true;
    for (let x = 0; x < 200; x += 15) {
        this.balloons.push({
            x: canvas_width - 20 - x,
            y: canvas_height + 150,
            speed: faster ? 3 : 2
        });
        faster = !faster;
    }
    this.onlevelend = onlevelend;
}

Level2.prototype.drawOn = function(ctx) {
    for (let balloon of this.balloons) {
        if (balloon.pierced) {
            ctx.drawImage(balloon_image, balloon_frame_width, 0, balloon_frame_width, balloon_frame_height, balloon.x, balloon.y, balloon_frame_width, balloon_frame_height);
        } else {
            ctx.drawImage(balloon_image, 0, 0, balloon_frame_width, balloon_frame_height, balloon.x, balloon.y, balloon_frame_width, balloon_frame_height);
        }
    }
}

Level2.prototype.update = function(arrows) {
    this.balloons = this.balloons.filter(balloon => {
        for (let arrow of arrows) {
            let y_dist = arrow.y - balloon.y,
                x_dist = arrow.x - balloon.x;
            if (!balloon.pierced &&
                y_dist > -arrow_height && y_dist < balloon_frame_height - 15 &&
                x_dist + arrow_width > -3 && x_dist + arrow_width < 3)
            {
                balloon.pierced = true;
                break;
            }
        }
        if (balloon.pierced) {
            balloon.y += 4;
        } else {
            balloon.y -= balloon.speed;
            if (balloon.y < -balloon_frame_height) {
                balloon.y += canvas_height + balloon_frame_height;
            }
        }
        return !(balloon.pierced && balloon.y > (canvas_height + balloon_frame_height));
    });
    if (this.balloons.length == 0) {
        onlevelend(true);
    }
}


let levels_count = 2;

function construct_level(n, onlevelend) {
    switch (n) {
    case 1:
        return new Level1(onlevelend);
    case 2:
        return new Level2(onlevelend);
    case 3:
        return new Level3(onlevelend);
    }
}

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

function TextDrawer(image, layout, line_height) {
    this.image = image;
    this.layout = layout;
    this.line_height = line_height;
}

TextDrawer.prototype.draw = function(ctx, x, y, text) {
    text = ('' + text).toUpperCase();
    let pos_x = x,
        pos_y = y;
    for (let char of text) {
        let layout = this.layout[char];
        if (layout) {
            let [cx, cy, cw, ch] = layout['rect'];
            let [ox, oy] = layout['offset'];
            ctx.drawImage(this.image, cx, cy, cw, ch, pos_x - ox, pos_y - oy, cw, ch);
            pos_x += layout['advance'];
        } else if (char == '\n') {
            pos_x = x;
            pos_y += this.line_height;
        }
    }
}

let status_font_image = new Image();
status_font_image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAAAICAYAAADEI3zOAAABO0lEQVR4nO1XyxXDMAjDfd5/ki7TETpJemj8HiEIkJ3coktKEZ/YtXDb9/PeRKSJyCZ/6M8a9vtht92uxER+m6cpHuotqo386D2yuMiP+Bkvex/2faOaXt7K+p9qvYLiDx646PvTKoZVEcsZtocoRozPUyqkDhEH1cz8yLaonHDNZU/xrK17zlR9BYf16ZCmSGQBZvNn8q/0FMUzOa/enCxf1D86lLf1UPnRDKDZP7uAaH57941I1e44XdWcV9dn7oBXIlLFE7cnjVjpRpcqj4ua8EYhiqcvaQCVcUQtHFk/g6cWSKErVwQdZ68bSGVtDW0f6nY5bqaHVdlmpLeqZNm4qYwjBuz4WM23EsvsQZQLruH494TUJELGs36PH9Wt9KFPxIx/cKIRyPbE5EBrMqOgKLd9isnP7qP8ACITjmUmA4ZKAAAAAElFTkSuQmCC';
let layout = {' ': {advance: 2, rect: [0, 8, 0, 0], offset: [0, 0]}, '!': {advance: 2, rect: [0, 0, 1, 8], offset: [0, 8]}, '0': {advance: 5, rect: [1, 0, 4, 8], offset: [0, 8]}, '1': {advance: 3, rect: [5, 0, 2, 8], offset: [0, 8]}, '2': {advance: 5, rect: [7, 0, 4, 8], offset: [0, 8]}, '3': {advance: 5, rect: [11, 0, 4, 8], offset: [0, 8]}, '4': {advance: 5, rect: [15, 0, 4, 8], offset: [0, 8]}, '5': {advance: 5, rect: [19, 0, 4, 8], offset: [0, 8]}, '6': {advance: 5, rect: [23, 0, 4, 8], offset: [0, 8]}, '7': {advance: 5, rect: [27, 0, 4, 8], offset: [0, 8]}, '8': {advance: 5, rect: [31, 0, 4, 8], offset: [0, 8]}, '9': {advance: 5, rect: [35, 0, 4, 8], offset: [0, 8]}, ':': {advance: 2, rect: [39, 2, 1, 4], offset: [0, 6]}, A: {advance: 5, rect: [40, 0, 4, 8], offset: [0, 8]}, B: {advance: 5, rect: [44, 0, 4, 8], offset: [0, 8]}, C: {advance: 5, rect: [48, 0, 4, 8], offset: [0, 8]}, D: {advance: 5, rect: [52, 0, 4, 8], offset: [0, 8]}, E: {advance: 5, rect: [56, 0, 4, 8], offset: [0, 8]}, F: {advance: 5, rect: [60, 0, 4, 8], offset: [0, 8]}, G: {advance: 5, rect: [64, 0, 4, 8], offset: [0, 8]}, H: {advance: 5, rect: [68, 0, 4, 8], offset: [0, 8]}, I: {advance: 2, rect: [72, 0, 1, 8], offset: [0, 8]}, J: {advance: 4, rect: [73, 0, 3, 8], offset: [0, 8]}, K: {advance: 5, rect: [76, 0, 4, 8], offset: [0, 8]}, L: {advance: 4, rect: [80, 0, 3, 8], offset: [0, 8]}, M: {advance: 6, rect: [83, 0, 5, 8], offset: [0, 8]}, N: {advance: 5, rect: [88, 0, 4, 8], offset: [0, 8]}, O: {advance: 5, rect: [92, 0, 4, 8], offset: [0, 8]}, P: {advance: 5, rect: [96, 0, 4, 8], offset: [0, 8]}, Q: {advance: 5, rect: [100, 0, 4, 8], offset: [0, 8]}, R: {advance: 5, rect: [104, 0, 4, 8], offset: [0, 8]}, S: {advance: 5, rect: [108, 0, 4, 8], offset: [0, 8]}, T: {advance: 4, rect: [112, 0, 3, 8], offset: [0, 8]}, U: {advance: 5, rect: [115, 0, 4, 8], offset: [0, 8]}, V: {advance: 6, rect: [119, 0, 5, 8], offset: [0, 8]}, W: {advance: 6, rect: [124, 0, 5, 8], offset: [0, 8]}, X: {advance: 5, rect: [129, 0, 4, 8], offset: [0, 8]}, Y: {advance: 5, rect: [133, 0, 4, 8], offset: [0, 8]}, Z: {advance: 5, rect: [137, 0, 4, 8], offset: [0, 8]}};
let status_font = new TextDrawer(status_font_image, layout, 20);


let bow = new Bow(80),
    arrows_remaining = 0,
    arrows = [],
    level_n,
    level,
    last_arrow_timeout = null;

function add_arrow(arrow) {
    arrows.push(arrow);
    if (!arrows_remaining) {
        last_arrow_timeout = setTimeout(_ => onlevelend(false), 5000);
    }
}

function onlevelend(success) {
    clearTimeout(last_arrow_timeout);
    last_arrow_timeout = null;
    if (success) {
        ++level_n;
        if (level_n > levels_count) {
            level_n = 1;
        }
    } else {
        level_n = 1;
    }
    level = construct_level(level_n, onlevelend);
    arrows_remaining = level.arrows_limit;
}

function draw() {
    ctx.drawImage(level.bg_image, 0, 0, level.bg_image.width, level.bg_image.height, 0, 0, canvas_width, canvas_height);
    bow.drawOn(ctx);
    for (let arrow of arrows) {
        ctx.drawImage(arrow_image, arrow.x, arrow.y);
    }
    level.drawOn(ctx);
    status_font.draw(ctx, 5, 20, 'score');
    status_font.draw(ctx, 35, 20, '000000');
    status_font.draw(ctx, canvas_width - 35, 20, 'arrows');
    ctx.fillStyle = '#e1d1ac';
    for (let pos_x = canvas_width - 42, arrows_drawn = 0; arrows_drawn < arrows_remaining; ++arrows_drawn, pos_x -= 3) {
        ctx.fillRect(pos_x, 12, 1, 8);
    }
    if (debug) {
        let count = check_colors_and_get_count();
        status_font.draw(ctx, canvas_width - 70, 45, `used colors: ${count}`);
    }

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

onlevelend(false);
update();
draw();

