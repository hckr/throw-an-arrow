document.body.innerHTML = `<canvas id=c width=360 height=400 style=position:fixed;top:0;left:0;width:100%;height:100%;image-rendering:-moz-crisp-edges;image-rendering:pixelated></canvas>`;

let is_fullscreen = false;

document.addEventListener('click', _ => {
    (c.requestFullscreen || c.webkitRequestFullscreen || c.mozRequestFullScreen).call(document.body);
    (c.requestPointerLock || c.mozRequestPointerLock).call(c);
    audioCtx.resume();
});

document.onwebkitfullscreenchange = document.onmozfullscreenchange = _ => {
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
addEventListener('resize', _ => canvas_real_height = parseInt(getComputedStyle(c, null).getPropertyValue('height')));

document.oncontextmenu = e => e.preventDefault();

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

let bow_image = new Image();
bow_image.src = 'data:image/png;base64,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';
let bow_frame_width = 35,
    bow_frame_height = 45;

let arrow_image = new Image();
arrow_image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAFBAMAAACz2AE9AAAAElBMVEVjb2yzekHAhkmVlaLh0azs3LchNeVpAAAAAXRSTlMAQObYZgAAADZJREFUeF49ikENADAIA0mmoJsCULCkFkAC/q2MftbH9R5nXaYtDqoDwCF5LdN3uJzjSuT63z/I6QXjEQxUpAAAAABJRU5ErkJggg==';
let arrow_width = 22,
    arrow_height = 5;

let balloon_image = new Image();
balloon_image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAoAgMAAACDXzJIAAAACVBMVEUAAGcAAAD/AABz6q9GAAAAAXRSTlMAQObYZgAAAFJJREFUCNdjYFjAAARMK0Ak1yoEqbWqAY1ctWoBMsnUACK5ICQDErsBIYtMAsWB5qCQYLvgJNANTECjA8CkAAMjVjKAgRVIOjCwwEmICDEqQSQADn4qw55gBtoAAAAASUVORK5CYII=';
let balloon_frame_width = 10,
    balloon_frame_height = 40;

let sky_image = new Image();
sky_image.src = 'data:image/png;base64,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';

let violet_image = new Image();
violet_image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABNAgMAAABF3KsBAAAADFBMVEVlLWeHI4/0TRGrzOLKGz3lAAAAAXRSTlMAQObYZgAAARtJREFUeF6N1EFq7DAQhGFvdD9vft6y7zcD7wATSE6Ra2TXm0BUgW4kRgnquKiNv0XJ9gw+RhrAuKgVTHKuaEPCVOtEBxPnBTURvaKAyf9WAMuHEGelLY+RSXIiW0UOiqSbs1MToTPAuVNMT+qAtpo0NbxWLNBccnynAcEOplXfF0Ue6owVh6lCaGrDkVLCgXNoLk49IDTvQcK01yN0BvNCTUtM2mrDrqunwr9Q7Em/gEUJNbkkp1S5MqlyjkLBJguOQiU3bOq5qvOk+dtD7lDpsf5T8UrJGxARldqYgFTq/MCNnVIzwQ4Dam3E6F5vI8vYXZ/ZRR/9ll307dGzi77oI/tj4X92XVDP/tL7L3299egl7aG9l6cV7+EbwHYseZ5pCJgAAAAASUVORK5CYII=';
let violet_pos_x = 0,
    violet_pos_y = 0,
    violet_width = 84,
    violet_height = 64,
    violet_minion_pos_x = 0,
    violet_minion_pos_y = 64,
    violet_minion_width = 12,
    violet_minion_height = 13;

let butterfly_image = new Image();
butterfly_image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAgAgMAAACnTJi2AAAADFBMVEVlLWccGxp6SP/Sw/Hr/zJIAAAAAXRSTlMAQObYZgAAAW1JREFUeF7VzTGO1DAYBeD3EzxTAUJacwTOYYrtfyT/QS7okkhZgZRicg8XcaRsPSM0gkNwhDRZaQ9AwS34bYlFoGVqeMWzLH96xj8RYlyO9RfAlZZcAHzQqpu/A5Fc6bFvPMDAJg6oPzmS7QFUub6aA0GA9rOC7qOC9tfjKpwnzVs9w5mB1zNX/eKKWIEX481UrbU32ztGPyt4dRtpyTI/ekBSs5etMefF49spAne3TGk5lHnpQdJOz8ZT3G/dBNsq2Gl918uawcImpWEngZ+E+VjdB0Z1FyLadtqPnmme2Wyn1SQBjf0HhDkCco7V/XJ8LuIpyUTy3pF4QOoGYxiAsY6Q0FDqT5V0R1gB7LXTM8J2EbA3A8augUggaT3IK4CiNw5GHLQYNnyB9VegNCDHOIBYkfsp6wkvrwEauQBSYH1BpRR51co9HmJNQVqcUZn9LUaXM4J9WiToD0Auo1Jl7tGQK+WKvBiV/3V+AG1kbadEN+fpAAAAAElFTkSuQmCC';
let butterfly_frame_width = 16,
    butterfly_frame_height = 32;

let bubble_image = new Image();
bubble_image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAAAsBAMAAADMatqKAAAAD1BMVEUAAADOv/WmmcS0nvnQwPXMCbvtAAAAAXRSTlMAQObYZgAAAPdJREFUeF7t1uGpwzAMBGDhDW4Dc8oE0gbZf6hHgh9ya0qaGkEpPowjCLnvhwmJPAVAux6rzedqY9uGDLdjuGcsA4jm/xnR1j8Uyogh9gljGcCpBNhK2tAV384y7gciPAi00pPsjMvg+rRAbunGtjHdID3ZAFTpJAGEK1MZDaqZcU81TE1tZ6rhak56qqFqRnvHQAxAf+K4NGimyUah0chUo9JUXVMNkub2aPRt8y8NsPOIpRok6e6pRuGZRENQSUrhwzm+KEa/33AhhawiqUatrMw3pDDVEKDW6B8/PBixIL/KEPkFY/ynDibKJt/EZXzsTRYvYyZ/Vbw36bu0YA0AAAAASUVORK5CYII=';
let bubble_frame_width = 22,
    bubble_frame_height = 44;




let BowState = Object.freeze({
    UNLOADED: 1,
    LOADED: 2,
    STRAINED: 3,
    OTHER: 4
});

class Bow {
    constructor(pos_y, arrow_speed) {
        this.frame = 0;
        this.state = BowState.UNLOADED;
        this.pos_y = pos_y;
        this.arrow_speed = arrow_speed;
        this.pos_y_min = 0;
        this.pos_y_max = canvas_height - bow_frame_height;
        this.strain_promise = null;
    }

    load_arrow() {
        if (this.state == BowState.UNLOADED) {
            this.frame = 1;
            this.state = BowState.LOADED;
            return true;
        }
        return false;
    }

    strain() {
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
                        that.state = BowState.STRAINED;
                        resolve();
                    }
                }, 30);
            })();
        });
    }

    release_arrow(add_arrow) {
        if (!this.strain_promise)
            return;
        let promise = this.strain_promise;
        this.strain_promise = null;
        promise.then(_ => {
            this.frame = 23;
            add_arrow({
                x: 0,
                y: this.pos_y + 20,
                speed: this.arrow_speed
            });
            let that = this;
            play(shoot_sound);
            (function restore_chord() {
                setTimeout(_ => {
                    if (--that.frame > 12) {
                        restore_chord();
                    } else {
                        that.state = BowState.UNLOADED;
                    }
                }, 10);
            })();
        });
    }

    move_y(diff) {
        this.pos_y += diff
        this.pos_y |= 0;
        if (this.pos_y < this.pos_y_min) {
            this.pos_y = this.pos_y_min;
        } else if (this.pos_y > this.pos_y_max) {
            this.pos_y = this.pos_y_max;
        }
    }

    set_y(new_y) {
        this.pos_y = new_y
        this.pos_y |= 0;
        if (this.pos_y < this.pos_y_min) {
            this.pos_y = this.pos_y_min;
        } else if (this.pos_y > this.pos_y_max) {
            this.pos_y = this.pos_y_max;
        }
    }

    draw_on(ctx) {
        ctx.drawImage(bow_image, (this.frame % 6) * bow_frame_width, ((this.frame / 6) | 0) * bow_frame_height, bow_frame_width, bow_frame_height,
                      0, this.pos_y, bow_frame_width, bow_frame_height);
    }
}




class BalloonLevelBase {
    constructor(onlevelend, arrows_limit, balloons) {
        this.arrows_limit = arrows_limit;
        this.balloons = balloons;
        this.onlevelend = onlevelend;

        this.bg_image = sky_image;
    }

    draw_on(ctx) {
        for (let balloon of this.balloons) {
            if (balloon.pierced) {
                ctx.drawImage(balloon_image, balloon_frame_width, 0, balloon_frame_width, balloon_frame_height, balloon.x, balloon.y, balloon_frame_width, balloon_frame_height);
            } else {
                ctx.drawImage(balloon_image, 0, 0, balloon_frame_width, balloon_frame_height, balloon.x, balloon.y, balloon_frame_width, balloon_frame_height);
            }
        }
    }

    update(arrows) {
        this.balloons = this.balloons.filter(balloon => {
            for (let arrow of arrows) {
                let y_dist = arrow.y - balloon.y,
                    x_dist = arrow.x - balloon.x;
                if (!balloon.pierced &&
                    y_dist > -arrow_height && y_dist < balloon_frame_height - 15 &&
                    x_dist + arrow_width > -3 && x_dist + arrow_width < 3)
                {
                    play(burst_sound);
                    add_score(10);
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

    can_safely_fail() {
        return this.balloons.length > 0 && this.balloons.filter(balloon => balloon.pierced).length == 0;
    }
}


class Balloons1 extends BalloonLevelBase {
    constructor(onlevelend) {
        let balloons = [];
        for (let x = 0; x < 200; x += 12) {
            balloons.push({
                x: canvas_width - 20 - x,
                y: canvas_height,
                speed: 2
            });
        }
        super(onlevelend, 18, balloons);

        this.title = 'Balloons';
        this.description = used_touch ?
`Touch (and hold) to load an arrow,
release... to release the arrow.
Move the bow while touching and holding.`
:
`Use a mouse to control the bow:
right click to load an arrow,
left click (and hold) to strain the bow,
and release... to release the arrow.
Move the bow while left clicking and holding.`;
    }
}



class Balloons2 extends BalloonLevelBase {
    constructor(onlevelend) {
        let balloons = [],
            faster = true;
        for (let x = 0; x < 200; x += 15) {
            balloons.push({
                x: canvas_width - 20 - x,
                y: canvas_height + 150,
                speed: faster ? 3 : 2
            });
            faster = !faster;
        }
        super(onlevelend, 25, balloons);

        this.title = 'More balloons';
        this.description = 'You might want to wait until they form a single line.';
    }
}




class Bubbles1 {
    constructor(onlevelend) {
        this.arrows_limit = 12;
        this.bubbles = [];
        this.butterflies = [];
        this.onlevelend = onlevelend;

        let odd = true;
        for (let x = 0; x < 240; x += 24) {
            this.bubbles.push({
                x: canvas_width - 30 - x,
                y: odd ? 0 : canvas_height - bubble_frame_height,
                speed: -2,
                frame: 0
            });
            odd = !odd;
        }

        this.bg_image = sky_image;

        this.title = 'Bubbles';
        this.description = 'Pop bubbles to rescue butterflies!';
    }

    draw_on(ctx) {
        for (let bubble of this.bubbles) {
            ctx.drawImage(bubble_image, bubble_frame_width * bubble.frame, 0, bubble_frame_width, bubble_frame_height, bubble.x, bubble.y, bubble_frame_width, bubble_frame_height);
        }
        for (let butterfly of this.butterflies) {
            ctx.drawImage(butterfly_image, butterfly_frame_width * butterfly.frame, 0, butterfly_frame_width, butterfly_frame_height, butterfly.x, butterfly.y, butterfly_frame_width, butterfly_frame_height);
        }
    }

    update(arrows) {
        this.bubbles = this.bubbles.filter(bubble => {
            for (let arrow of arrows) {
                let diff_y = (arrow.y + 2) - bubble.y,
                    diff_x = (arrow.x + arrow_width) - bubble.x;
                if (!bubble.pierced &&
                    (diff_y >= 0 && diff_y <= 7 && diff_x >= 4 && diff_x <= 7) ||
                    (diff_y >= 8 && diff_y <= 11 && diff_x >= 2 && diff_x <= 5) ||
                    (diff_y >= 12 && diff_y <= 23 && diff_x >= 0 && diff_x <= 3) ||
                    (diff_y >= 24 && diff_y <= 27 && diff_x >= 2 && diff_x <= 5) ||
                    (diff_y >= 28 && diff_y <= 31 && diff_x >= 4 && diff_x <= 7) ||
                    (diff_y >= 32 && diff_y <= 42 && diff_x >= 6 && diff_x <= 9))
                {
                    play(air_hit_sound);
                    add_score(10);
                    bubble.pierced = true;
                    this.butterflies.push({
                        x: bubble.x - 1,
                        y: bubble.y + 12,
                        frame: 0
                    });
                    break;
                }
            }
            if (bubble.pierced) {
                ++bubble.frame;
            } else {
                bubble.y -= bubble.speed;
                if (bubble.y <= -4 || bubble.y > canvas_height - bubble_frame_height + 4)
                {
                    bubble.speed = -bubble.speed;
                }
            }
            return !(bubble.pierced && bubble.frame >= 9);
        });
        this.butterflies = this.butterflies.filter(butterfly => {
            butterfly.x -= 2;
            butterfly.y -= 2;
            butterfly.frame = (butterfly.frame + 1) % 8;
            return butterfly.y > -butterfly_frame_height;
        });
        if (this.bubbles.length == 0 && this.butterflies.length == 0) {
            onlevelend(true);
        }
    }

    can_safely_fail() {
        return this.bubbles.length > 0 && this.butterflies.length == 0;
    }
}




let VioletState = Object.freeze({
    INACTIVE: 1,
    HIDDEN: 2,
    HIDING: 3,
    SHOWING: 4,
    OTHER: 5
});

class VioletLevelBase {
    constructor(onlevelend, arrows_limit) {
        this.bg_image = sky_image;
        this.arrows_limit = arrows_limit;
        this.onlevelend = onlevelend;
        this.violets = [];
        let inactive = [];
        for (let i = 0; i < 4; ++i) {
            this.violets.push({
                x: canvas_width,
                y: 45 + i * 93,
                health: 10,
                state: VioletState.INACTIVE
            });
            inactive.push([i, Math.random()]);
        }
        this.inactive = inactive.sort((a, b) => a[1] < b[1]).map(a => a[0]);
        this.release_violet();
        this.game_over = false;
    }

    release_violet() {
        let id = this.inactive.pop();
        if (id != undefined) {
            this.violets[id].state = VioletState.HIDDEN;
        }
    }

    draw_on(ctx) {
        for (let violet of this.violets) {
            ctx.fillStyle = '#87238f';
            let pos_y = violet.y - 8;
            for (let pos_x = violet.x + 10, health_drawn = 0; health_drawn < violet.health; ++health_drawn, pos_x += 6) {
                ctx.fillRect(pos_x, pos_y, 5, 2);
            }
            ctx.drawImage(violet_image, violet_pos_x, violet_pos_y, violet_width,
                          violet_height, violet.x, violet.y, violet_width, violet_height);
        }
    }

    check_if_level_end() {
        if (this.violets.length == 0) {
            onlevelend(true);
        } else if (this.game_over) {
            onlevelend(false)
        }
    }

    update(arrows) {
        this.violets = this.violets.filter(violet => {
            if (violet.state == VioletState.SHOWING) {
                for (let arrow of arrows) {
                    let diff_y = (arrow.y + 2) - violet.y,
                        diff_x = (arrow.x + arrow_width) - violet.x;
                    if ((diff_y >= -2 && diff_y <= 1 && diff_x >= 34 && diff_x <= 37) ||
                        (diff_y >= 2 && diff_y <= 3 && diff_x >= 28 && diff_x <= 31) ||
                        (diff_y >= 4 && diff_y <= 5 && diff_x >= 26 && diff_x <= 29) ||
                        (diff_y >= 6 && diff_y <= 11 && diff_x >= 22 && diff_x <= 25) ||
                        (diff_y >= 12 && diff_y <= 13 && diff_x >= 8 && diff_x <= 11) ||
                        (diff_y >= 14 && diff_y <= 15 && diff_x >= 2 && diff_x <= 5) ||
                        (diff_y >= 16 && diff_y <= 29 && diff_x >= 0 && diff_x <= 3) ||
                        (diff_y >= 30 && diff_y <= 31 && diff_x >= 2 && diff_x <= 5) ||
                        (diff_y >= 32 && diff_y <= 33 && diff_x >= 4 && diff_x <= 7) ||
                        (diff_y >= 34 && diff_y <= 37 && diff_x >= 8 && diff_x <= 11) ||
                        (diff_y >= 38 && diff_y <= 51 && diff_x >= 6 && diff_x <= 9) ||
                        (diff_y >= 52 && diff_y <= 55 && diff_x >= 8 && diff_x <= 11) ||
                        (diff_y >= 56 && diff_y <= 57 && diff_x >= 10 && diff_x <= 13) ||
                        (diff_y >= 58 && diff_y <= 59 && diff_x >= 14 && diff_x <= 17) ||
                        (diff_y >= 60 && diff_y <= 61 && diff_x >= 44 && diff_x <= 47) ||
                        (diff_y >= 62 && diff_y <= 65 && diff_x >= 46 && diff_x <= 49))
                    {
                        play(air_hit_sound);
                        add_score(10);
                        --violet.health;
                        violet.state = VioletState.HIDING;
                        this.release_violet();
                        break;
                    }
                }
            }
            switch (violet.state) {
            case VioletState.HIDDEN:
                violet.state = VioletState.OTHER;
                setTimeout(_ => {
                    violet.state = VioletState.SHOWING;
                }, 1000);
                break;
            case VioletState.SHOWING:
                violet.x -= 1;
                break;
            case VioletState.HIDING:
                if (violet.x < canvas_width) {
                    violet.x += 3;
                } else {
                    violet.state = VioletState.HIDDEN;
                }
                break;
            }
            if (violet.x <= -violet_width / 2) {
                this.game_over = true;
            }
            return !(violet.health <= 0 && violet.state == VioletState.HIDDEN);
        });
        this.check_if_level_end();
    }

    can_safely_fail() {
        return this.violets.length > 0 && this.violets.filter(violet => violet.health <= 0).length == 0;
    }
}


class Violet1 extends VioletLevelBase {
    constructor(onlevelend) {
        super(onlevelend, 45);

        this.title = 'Bad weather';
        this.description =
`Some angry clouds are on their way.
Don't let them ruin the weather.
You have to hit them multiple times
until they go away.`;
    }
}



class Violet2 extends VioletLevelBase {
    constructor(onlevelend) {
        super(onlevelend, 55);
        this.minions = [];
        setTimeout(_ => this.release_minion(true), 1500);

        this.title = 'Even worse weather';
        this.description =
`The clouds are not giving up!
Now they can shoot something which
is stopping your arrows
and can damage your bow!
Just let it fly away, don't waste arrows.`;
    }

    release_minion(timeout) {
        let ready_violets = this.violets.filter(violet => violet.state == VioletState.SHOWING && violet.x > 200);
        if (ready_violets.length == 0) {
            setTimeout(_ => this.release_minion(timeout), 100);
            return;
        }
        let violet = ready_violets[(Math.random() * ready_violets.length) | 0];
        this.minions.push({
            x: violet.x + 40,
            y: violet.y + Math.random() * 52,
            frame: 0
        });
        if (timeout) {
            setTimeout(_ => this.release_minion(true), 4000);
        }
    }

    draw_on(ctx) {
        for (let minion of this.minions) {
            ctx.drawImage(violet_image, violet_minion_pos_x, violet_minion_pos_y,
                          violet_minion_width, violet_minion_height, minion.x, minion.y,
                          violet_minion_width, violet_minion_height);
        }
        super.draw_on(ctx);
    }

    update(arrows) {
        this.minions = this.minions.filter(minion => {
            minion.x -= 1.5;
            let bow_diff_y = minion.y - bow.pos_y;
            if (minion.x < bow_frame_width / 2 && bow_diff_y < bow_frame_height && bow_diff_y > -violet_minion_height) {
                this.game_over = true;
            }
            for (let arrow of arrows) {
                if (arrow.speed > 0) {
                    let diff_y = arrow.y - minion.y,
                        diff_x = (arrow.x + arrow_width) - minion.x;
                    if (diff_y >= 0 && diff_y <= violet_minion_height - 2 && diff_x >= 2 && diff_x <= 6) {
                        play(air_hit_sound);
                        arrow.speed = -1.5;
                    }
                }
            }
            return minion.x > -violet_minion_width;
        });
        super.update(arrows);
    }
}


let levels_count = 5;

function construct_level(n, onlevelend) {
    switch (n) {
    case 1:
        return new Balloons1(onlevelend);
    case 2:
        return new Balloons2(onlevelend);
    case 3:
        return new Bubbles1(onlevelend);
    case 4:
        return new Violet1(onlevelend);
    case 5:
        return new Violet2(onlevelend);
    }
}

let used_touch = false;

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

function mousemove(e) {
    if (!is_fullscreen) {
        return;
    }
    if (game_state == GameState.LEVEL_PLAY && mouse_down) {
        if (e.movementY === undefined) {
            let diff = (e.pageY - mouse_down_y) * canvas_height / canvas_real_height;
            bow.set_y(mouse_down_bow_pos_y + diff * 1.5);
        } else {
            bow.move_y(e.movementY * canvas_height / canvas_real_height);
        }
    }
}

document.addEventListener('mousedown', mousedown);
document.addEventListener('mouseup', mouseup);
document.addEventListener('mousemove', mousemove);

document.addEventListener('touchstart', e => {
    used_touch = true;
    mousedown({which: 3});
    mousedown({which: 1, pageY: e.touches[0].pageY});
});

document.addEventListener('touchend', e => {
    mouseup({which: 1});
});

document.addEventListener('touchmove', e => {
    mousemove({pageY: e.touches[0].pageY});
});

class TextDrawer {
    constructor(image, layout, line_height) {
        this.image = image;
        this.layout = layout;
        this.line_height = line_height;
    }

    draw(ctx, x, y, text) {
        let uptext = ('' + text).toUpperCase(),
            pos_x = x,
            pos_y = y;
        for (let char of uptext) {
            let layout = this.layout[char];
            if (layout) {
                let [cx, cy, cw, ch] = layout['rect'],
                    [ox, oy] = layout['offset'],
                    target_x = pos_x - ox,
                    target_y = pos_y - oy;
                if (cw) {
                    ctx.drawImage(this.image, cx, cy, cw, ch, target_x, target_y, cw, ch);
                }
                pos_x += layout['advance'];
            } else if (char == '\n') {
                pos_x = x;
                pos_y += this.line_height;
            }
        }
    }

    measure(text) {
        let uptext = ('' + text).toUpperCase(),
            max_width = 0,
            width = 0,
            height = this.line_height;
        for (let char of uptext) {
            let layout = this.layout[char];
            if (layout) {
                width += layout['advance'];

            } else if (char == '\n') {
                max_width = Math.max(width, max_width);
                width = 0;
                height += this.line_height;
            }
        }
        return [Math.max(width, max_width), height]
    }

    draw_centered(ctx, text, y) {
        let pos_y = y,
            uptext = ('' + text).toUpperCase(),
            lines = uptext.split('\n');
        if (pos_y === undefined) {
            let height = (lines.length - 1) * this.line_height;
            pos_y = ((ctx.canvas.height - height) / 2) | 0;
        }
        for (let line of lines) {
            let pos_x = ((ctx.canvas.width - this.measure(line)[0]) / 2) | 0;
            this.draw(ctx, pos_x, pos_y, line);
            pos_y += this.line_height;
        }
    }

    draw_bottom_centered(ctx, text) {
        let uptext = ('' + text).toUpperCase(),
            lines = uptext.split('\n'),
            height = (lines.length - 1) * this.line_height,
            y = ctx.canvas.height - height - 10;
        this.draw_centered(ctx, text, y)
    }
}


let status_font_image = new Image();
status_font_image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAAAICAYAAADEI3zOAAABHUlEQVR42u1WyRHCMAzcZdx/JTRDCVQiHsCMEbZ1xXlFrzi6b/H5uAsAAhC8of/uQf//vvl5e3hWeC2HHZ0sbMBCxwhP452RO6O36Cx/ov5G4+iJ/5+uGy64IAitqyaqbxlU6ahqZ5U+4oHCibPCPR2LiS9w+GH55elwFLo4+8YgZzvgJz7NwRA1JJJ8JB2VIr0UZR6dHCnYz7NtaMFqk+DN4qlevWdH94YEbDojgLv0R25AbNJr3nPNMESPbhoThY6JIxOeEX/4SEusTMkE7uCJQ6NwrRh7VyUXU1br4OSMQFPJrI5iqYy9wCST4nv3+ti53uTAHEhmJd4Glc5Cd6zwNGgYlA/VERm8ZwUiERuvDBZXEB2yudgSmTziBSITjmXab+DjAAAAAElFTkSuQmCC';
let status_font_layout = {' ': {advance: 2, rect: [0, 8, 0, 0], offset: [0, 0]}, '!': {advance: 2, rect: [0, 0, 1, 8], offset: [0, 8]}, '0': {advance: 5, rect: [1, 0, 4, 8], offset: [0, 8]}, '1': {advance: 3, rect: [5, 0, 2, 8], offset: [0, 8]}, '2': {advance: 5, rect: [7, 0, 4, 8], offset: [0, 8]}, '3': {advance: 5, rect: [11, 0, 4, 8], offset: [0, 8]}, '4': {advance: 5, rect: [15, 0, 4, 8], offset: [0, 8]}, '5': {advance: 5, rect: [19, 0, 4, 8], offset: [0, 8]}, '6': {advance: 5, rect: [23, 0, 4, 8], offset: [0, 8]}, '7': {advance: 5, rect: [27, 0, 4, 8], offset: [0, 8]}, '8': {advance: 5, rect: [31, 0, 4, 8], offset: [0, 8]}, '9': {advance: 5, rect: [35, 0, 4, 8], offset: [0, 8]}, ':': {advance: 2, rect: [39, 2, 1, 4], offset: [0, 6]}, A: {advance: 5, rect: [40, 0, 4, 8], offset: [0, 8]}, B: {advance: 5, rect: [44, 0, 4, 8], offset: [0, 8]}, C: {advance: 5, rect: [48, 0, 4, 8], offset: [0, 8]}, D: {advance: 5, rect: [52, 0, 4, 8], offset: [0, 8]}, E: {advance: 5, rect: [56, 0, 4, 8], offset: [0, 8]}, F: {advance: 5, rect: [60, 0, 4, 8], offset: [0, 8]}, G: {advance: 5, rect: [64, 0, 4, 8], offset: [0, 8]}, H: {advance: 5, rect: [68, 0, 4, 8], offset: [0, 8]}, I: {advance: 2, rect: [72, 0, 1, 8], offset: [0, 8]}, J: {advance: 4, rect: [73, 0, 3, 8], offset: [0, 8]}, K: {advance: 5, rect: [76, 0, 4, 8], offset: [0, 8]}, L: {advance: 4, rect: [80, 0, 3, 8], offset: [0, 8]}, M: {advance: 6, rect: [83, 0, 5, 8], offset: [0, 8]}, N: {advance: 5, rect: [88, 0, 4, 8], offset: [0, 8]}, O: {advance: 5, rect: [92, 0, 4, 8], offset: [0, 8]}, P: {advance: 5, rect: [96, 0, 4, 8], offset: [0, 8]}, Q: {advance: 5, rect: [100, 0, 4, 8], offset: [0, 8]}, R: {advance: 5, rect: [104, 0, 4, 8], offset: [0, 8]}, S: {advance: 5, rect: [108, 0, 4, 8], offset: [0, 8]}, T: {advance: 4, rect: [112, 0, 3, 8], offset: [0, 8]}, U: {advance: 5, rect: [115, 0, 4, 8], offset: [0, 8]}, V: {advance: 6, rect: [119, 0, 5, 8], offset: [0, 8]}, W: {advance: 6, rect: [124, 0, 5, 8], offset: [0, 8]}, X: {advance: 5, rect: [129, 0, 4, 8], offset: [0, 8]}, Y: {advance: 5, rect: [133, 0, 4, 8], offset: [0, 8]}, Z: {advance: 5, rect: [137, 0, 4, 8], offset: [0, 8]}};
let status_font = new TextDrawer(status_font_image, status_font_layout, 20);

let status_number_font_image = new Image();
status_number_font_image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAICAYAAAC73qx6AAAAdElEQVR42mN8eHHNfwb8gBFKE1KHTQ+p+sgGTAzDBLDgCEFsscCIpvc/DjFiYgmXfgYc5jESEmOhY6D9J0KMkdIYoZZDaJUvCNpNaowQkxRISYL4CgWYvv94kj5JSes/LZICGTFAVNL6T6ZBlKojtnAg6D4AN4gmaroLxoEAAAAASUVORK5CYII=';
let status_number_font_layout = {'0': {advance: 6, rect: [0, 0, 5, 8], offset: [0, 8]}, '1': {advance: 6, rect: [5, 0, 5, 8], offset: [0, 8]}, '2': {advance: 6, rect: [10, 0, 5, 8], offset: [0, 8]}, '3': {advance: 6, rect: [15, 0, 5, 8], offset: [0, 8]}, '4': {advance: 6, rect: [20, 0, 5, 8], offset: [0, 8]}, '5': {advance: 6, rect: [25, 0, 5, 8], offset: [0, 8]}, '6': {advance: 6, rect: [30, 0, 5, 8], offset: [0, 8]}, '7': {advance: 6, rect: [35, 0, 5, 8], offset: [0, 8]}, '8': {advance: 6, rect: [40, 0, 5, 8], offset: [0, 8]}, '9': {advance: 6, rect: [45, 0, 5, 8], offset: [0, 8]}};
let status_number_font = new TextDrawer(status_number_font_image, status_number_font_layout, 20);

let big_font_image = new Image();
big_font_image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcYAAAAfCAYAAAB9JG16AAAB3UlEQVR42u3dW3LrIAwAUOhk/4vpqu5P16B+9nEnHkcITNJzvtqOZWwQVtyhtH/8e4/2pX/7+vvP251jjo47I3Ouo5h+J2bkGh/pm7aonX4Qn4lpk8Y9c50VeZRppy+KaYvydaSNyuvqhXl6dW7uPAdmjXkmPhJz5Oo8/eGtAQAKIwAojACgMAKAwggAKbdf32dWePYH48+e62zMqMxqzV7YfhSMQRuMaRe0WdnvcdH4jsZU5mssfnacXYUYm+ZZPNEcaCf7mnw/hzdGALhDYQQAhREAFEYAUBgB4BG3Re3M3Hd1dGVW5Z6NZ88Rg+0c9dvoPp+x2fjOyr3qmEx8PPncewar7n/VXH0ls/aFHh4nb4wAoDACgMIIAAojACiMAJA0c1Xqs69yq94XsXKlYky8v63+k3aBv77vaX/R+Vk9/n+9n6/YgzXzrOuT2vmvMK7ohF54XMUD+orNyiv7Y7f74f546PfX/YA8a+7Hxnk6K7e32rjdr1IBQGEEAIURABRGAFAYASDp1h5fprtkueyBiuXXkWgnJvXN0TkqN0DuE8dnqw2AJ+ZeZqyqxYJr2Wkl7az5cNVYjs7Vyn46Ez/6p0txQZ4Ob9zujREAFEYAUBgBQGEEAIURAJI+Ad04lbJYI1IrAAAAAElFTkSuQmCC';
let big_font_layout = {' ': {advance: 6, rect: [0, 31, 0, 0], offset: [0, 0]}, '!': {advance: 6, rect: [0, 0, 3, 31], offset: [0, 31]}, '0': {advance: 15, rect: [3, 0, 13, 31], offset: [0, 31]}, '1': {advance: 9, rect: [16, 0, 6, 31], offset: [0, 31]}, '2': {advance: 15, rect: [22, 0, 13, 31], offset: [0, 31]}, '3': {advance: 15, rect: [35, 0, 13, 31], offset: [0, 31]}, '4': {advance: 15, rect: [48, 0, 13, 31], offset: [0, 31]}, '5': {advance: 15, rect: [61, 0, 13, 31], offset: [0, 31]}, '6': {advance: 15, rect: [74, 0, 13, 31], offset: [0, 31]}, '7': {advance: 15, rect: [87, 0, 13, 31], offset: [0, 31]}, '8': {advance: 15, rect: [100, 0, 13, 31], offset: [0, 31]}, '9': {advance: 15, rect: [113, 0, 13, 31], offset: [0, 31]}, ':': {advance: 6, rect: [126, 6, 3, 19], offset: [0, 25]}, A: {advance: 15, rect: [129, 0, 13, 31], offset: [0, 31]}, B: {advance: 15, rect: [142, 0, 13, 31], offset: [0, 31]}, C: {advance: 15, rect: [155, 0, 13, 31], offset: [0, 31]}, D: {advance: 15, rect: [168, 0, 13, 31], offset: [0, 31]}, E: {advance: 15, rect: [181, 0, 13, 31], offset: [0, 31]}, F: {advance: 15, rect: [194, 0, 13, 31], offset: [0, 31]}, G: {advance: 15, rect: [207, 0, 13, 31], offset: [0, 31]}, H: {advance: 15, rect: [220, 0, 13, 31], offset: [0, 31]}, I: {advance: 6, rect: [233, 0, 3, 31], offset: [0, 31]}, J: {advance: 12, rect: [236, 0, 9, 31], offset: [0, 31]}, K: {advance: 15, rect: [245, 0, 13, 31], offset: [0, 31]}, L: {advance: 12, rect: [258, 0, 9, 31], offset: [0, 31]}, M: {advance: 18, rect: [267, 0, 16, 31], offset: [0, 31]}, N: {advance: 15, rect: [283, 0, 13, 31], offset: [0, 31]}, O: {advance: 15, rect: [296, 0, 13, 31], offset: [0, 31]}, P: {advance: 15, rect: [309, 0, 13, 31], offset: [0, 31]}, Q: {advance: 15, rect: [322, 0, 13, 31], offset: [0, 31]}, R: {advance: 15, rect: [335, 0, 13, 31], offset: [0, 31]}, S: {advance: 15, rect: [348, 0, 13, 31], offset: [0, 31]}, T: {advance: 12, rect: [361, 0, 9, 31], offset: [0, 31]}, U: {advance: 15, rect: [370, 0, 13, 31], offset: [0, 31]}, V: {advance: 18, rect: [383, 0, 16, 31], offset: [0, 31]}, W: {advance: 18, rect: [399, 0, 16, 31], offset: [0, 31]}, X: {advance: 15, rect: [415, 0, 13, 31], offset: [0, 31]}, Y: {advance: 15, rect: [428, 0, 13, 31], offset: [0, 31]}, Z: {advance: 15, rect: [441, 0, 13, 31], offset: [0, 31]}};
let big_font = new TextDrawer(big_font_image, big_font_layout, 50);

let normal_font_image = new Image();
normal_font_image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJgAAAALCAYAAACDMETMAAABS0lEQVR42u1YURYCIQh0ep6+89T56KM+NhMYUHv7yvlTcUHAgRW3613KEyg+5CV33CMduXYeh72F3GOtt99BY6NmQzF09NbhjDPf1eQ9Oe880fNG/cj4/0PXpWxsLEQNyIrCRO1cUcbWDertaXULeXMYJujpFMIm5lwMc5QBdsiOtSo0G2/+qUSgVij+R6wM6rfPQce0BtmLkbOcKYa8xURav9HrjyRoE2ujNicBn8wA62PNR7NtMONaiYyMJleKSoNJLgk9v8Aes3zPlOss40q2BxuhTyGD3a5byY1OjzYjoZieCwNnWt1qINgHZxKo1aH2fdUIokbtcBpI1ilWeQPxTOE9H4TpnPytj5REGWQb70nIs8cqj704wkhMyZTly4IMP0PzuXGiZwokAobB4CI5h4A8komYXR+1B8Q8Bu2Z4UNEbNwPrRtL8QCyHZYlRBpGsAAAAABJRU5ErkJggg==';
let normal_font_layout = {' ': {advance: 2, rect: [0, 9, 0, 0], offset: [0, 0]}, '!': {advance: 2, rect: [0, 0, 1, 9], offset: [0, 9]}, '\'': {advance: 2, rect: [1, 0, 1, 3], offset: [0, 9]}, ',': {advance: 2, rect: [2, 8, 1, 3], offset: [0, 1]}, '-': {advance: 4, rect: [3, 3, 3, 2], offset: [0, 6]}, '.': {advance: 2, rect: [6, 7, 1, 2], offset: [0, 2]}, '/': {advance: 6, rect: [7, 0, 5, 9], offset: [0, 9]}, '0': {advance: 5, rect: [12, 0, 4, 9], offset: [0, 9]}, '1': {advance: 3, rect: [16, 0, 2, 9], offset: [0, 9]}, '2': {advance: 5, rect: [18, 0, 4, 9], offset: [0, 9]}, '3': {advance: 5, rect: [22, 0, 4, 9], offset: [0, 9]}, '4': {advance: 5, rect: [26, 0, 4, 9], offset: [0, 9]}, '5': {advance: 5, rect: [30, 0, 4, 9], offset: [0, 9]}, '6': {advance: 5, rect: [34, 0, 4, 9], offset: [0, 9]}, '7': {advance: 5, rect: [38, 0, 4, 9], offset: [0, 9]}, '8': {advance: 5, rect: [42, 0, 4, 9], offset: [0, 9]}, '9': {advance: 5, rect: [46, 0, 4, 9], offset: [0, 9]}, ':': {advance: 2, rect: [50, 2, 1, 6], offset: [0, 7]}, A: {advance: 5, rect: [51, 0, 4, 9], offset: [0, 9]}, B: {advance: 5, rect: [55, 0, 4, 9], offset: [0, 9]}, C: {advance: 5, rect: [59, 0, 4, 9], offset: [0, 9]}, D: {advance: 5, rect: [63, 0, 4, 9], offset: [0, 9]}, E: {advance: 5, rect: [67, 0, 4, 9], offset: [0, 9]}, F: {advance: 5, rect: [71, 0, 4, 9], offset: [0, 9]}, G: {advance: 5, rect: [75, 0, 4, 9], offset: [0, 9]}, H: {advance: 5, rect: [79, 0, 4, 9], offset: [0, 9]}, I: {advance: 2, rect: [83, 0, 1, 9], offset: [0, 9]}, J: {advance: 4, rect: [84, 0, 3, 9], offset: [0, 9]}, K: {advance: 5, rect: [87, 0, 4, 9], offset: [0, 9]}, L: {advance: 4, rect: [91, 0, 3, 9], offset: [0, 9]}, M: {advance: 6, rect: [94, 0, 5, 9], offset: [0, 9]}, N: {advance: 5, rect: [99, 0, 4, 9], offset: [0, 9]}, O: {advance: 5, rect: [103, 0, 4, 9], offset: [0, 9]}, P: {advance: 5, rect: [107, 0, 4, 9], offset: [0, 9]}, Q: {advance: 5, rect: [111, 0, 4, 9], offset: [0, 9]}, R: {advance: 5, rect: [115, 0, 4, 9], offset: [0, 9]}, S: {advance: 5, rect: [119, 0, 4, 9], offset: [0, 9]}, T: {advance: 4, rect: [123, 0, 3, 9], offset: [0, 9]}, U: {advance: 5, rect: [126, 0, 4, 9], offset: [0, 9]}, V: {advance: 6, rect: [130, 0, 5, 9], offset: [0, 9]}, W: {advance: 6, rect: [135, 0, 5, 9], offset: [0, 9]}, X: {advance: 5, rect: [140, 0, 4, 9], offset: [0, 9]}, Y: {advance: 5, rect: [144, 0, 4, 9], offset: [0, 9]}, Z: {advance: 5, rect: [148, 0, 4, 9], offset: [0, 9]}};
let normal_font = new TextDrawer(normal_font_image, normal_font_layout, 15);

let shoot_sound = 'data:audio/ogg;base64,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',
    burst_sound = 'data:audio/ogg;base64,T2dnUwACAAAAAAAAAAAvOjQDAAAAANMfMEoBHgF2b3JiaXMAAAAAASgjAAAAAAAAIE4AAAAAAACZAU9nZ1MAAAAAAAAAAAAALzo0AwEAAAAWKsQ8C0X///////////+1A3ZvcmJpczUAAABYaXBoLk9yZyBsaWJWb3JiaXMgSSAyMDE4MDMxNiAoTm93IDEwMCUgZmV3ZXIgc2hlbGxzKQAAAAABBXZvcmJpcxJCQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBADIAAAYhiGH3knMkFOQSSYpVcw5CKH1DjnlFGTSUsaYYoxRzpBTDDEFMYbQKYUQ1E45pQwiCENInWTOIEs96OBi5zgQGrIiAIgCAACMQYwhxpBzDEoGIXKOScggRM45KZ2UTEoorbSWSQktldYi55yUTkompbQWUsuklNZCKwUAAAQ4AAAEWAiFhqwIAKIAABCDkFJIKcSUYk4xh5RSjinHkFLMOcWYcowx6CBUzDHIHIRIKcUYc0455iBkDCrmHIQMMgEAAAEOAAABFkKhISsCgDgBAIMkaZqlaaJoaZooeqaoqqIoqqrleabpmaaqeqKpqqaquq6pqq5seZ5peqaoqp4pqqqpqq5rqqrriqpqy6ar2rbpqrbsyrJuu7Ks256qyrapurJuqq5tu7Js664s27rkearqmabreqbpuqrr2rLqurLtmabriqor26bryrLryratyrKua6bpuqKr2q6purLtyq5tu7Ks+6br6rbqyrquyrLu27au+7KtC7vourauyq6uq7Ks67It67Zs20LJ81TVM03X9UzTdVXXtW3VdW1bM03XNV1XlkXVdWXVlXVddWVb90zTdU1XlWXTVWVZlWXddmVXl0XXtW1Vln1ddWVfl23d92VZ133TdXVblWXbV2VZ92Vd94VZt33dU1VbN11X103X1X1b131htm3fF11X11XZ1oVVlnXf1n1lmHWdMLqurqu27OuqLOu+ruvGMOu6MKy6bfyurQvDq+vGseu+rty+j2rbvvDqtjG8um4cu7Abv+37xrGpqm2brqvrpivrumzrvm/runGMrqvrqiz7uurKvm/ruvDrvi8Mo+vquirLurDasq/Lui4Mu64bw2rbwu7aunDMsi4Mt+8rx68LQ9W2heHVdaOr28ZvC8PSN3a+AACAAQcAgAATykChISsCgDgBAAYhCBVjECrGIIQQUgohpFQxBiFjDkrGHJQQSkkhlNIqxiBkjknIHJMQSmiplNBKKKWlUEpLoZTWUmotptRaDKG0FEpprZTSWmopttRSbBVjEDLnpGSOSSiltFZKaSlzTErGoKQOQiqlpNJKSa1lzknJoKPSOUippNJSSam1UEproZTWSkqxpdJKba3FGkppLaTSWkmptdRSba21WiPGIGSMQcmck1JKSamU0lrmnJQOOiqZg5JKKamVklKsmJPSQSglg4xKSaW1kkoroZTWSkqxhVJaa63VmFJLNZSSWkmpxVBKa621GlMrNYVQUgultBZKaa21VmtqLbZQQmuhpBZLKjG1FmNtrcUYSmmtpBJbKanFFluNrbVYU0s1lpJibK3V2EotOdZaa0ot1tJSjK21mFtMucVYaw0ltBZKaa2U0lpKrcXWWq2hlNZKKrGVklpsrdXYWow1lNJiKSm1kEpsrbVYW2w1ppZibLHVWFKLMcZYc0u11ZRai621WEsrNcYYa2415VIAAMCAAwBAgAlloNCQlQBAFAAAYAxjjEFoFHLMOSmNUs45JyVzDkIIKWXOQQghpc45CKW01DkHoZSUQikppRRbKCWl1losAACgwAEAIMAGTYnFAQoNWQkARAEAIMYoxRiExiClGIPQGKMUYxAqpRhzDkKlFGPOQcgYc85BKRljzkEnJYQQQimlhBBCKKWUAgAAChwAAAJs0JRYHKDQkBUBQBQAAGAMYgwxhiB0UjopEYRMSielkRJaCylllkqKJcbMWomtxNhICa2F1jJrJcbSYkatxFhiKgAA7MABAOzAQig0ZCUAkAcAQBijFGPOOWcQYsw5CCE0CDHmHIQQKsaccw5CCBVjzjkHIYTOOecghBBC55xzEEIIoYMQQgillNJBCCGEUkrpIIQQQimldBBCCKGUUgoAACpwAAAIsFFkc4KRoEJDVgIAeQAAgDFKOSclpUYpxiCkFFujFGMQUmqtYgxCSq3FWDEGIaXWYuwgpNRajLV2EFJqLcZaQ0qtxVhrziGl1mKsNdfUWoy15tx7ai3GWnPOuQAA3AUHALADG0U2JxgJKjRkJQCQBwBAIKQUY4w5h5RijDHnnENKMcaYc84pxhhzzjnnFGOMOeecc4wx55xzzjnGmHPOOeecc84556CDkDnnnHPQQeicc845CCF0zjnnHIQQCgAAKnAAAAiwUWRzgpGgQkNWAgDhAACAMZRSSimllFJKqKOUUkoppZRSAiGllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimVUkoppZRSSimllFJKKaUAIN8KBwD/BxtnWEk6KxwNLjRkJQAQDgAAGMMYhIw5JyWlhjEIpXROSkklNYxBKKVzElJKKYPQWmqlpNJSShmElGILIZWUWgqltFZrKam1lFIoKcUaS0qppdYy5ySkklpLrbaYOQelpNZaaq3FEEJKsbXWUmuxdVJSSa211lptLaSUWmstxtZibCWlllprqcXWWkyptRZbSy3G1mJLrcXYYosxxhoLAOBucACASLBxhpWks8LR4EJDVgIAIQEABDJKOeecgxBCCCFSijHnoIMQQgghREox5pyDEEIIIYSMMecghBBCCKGUkDHmHIQQQgghhFI65yCEUEoJpZRSSucchBBCCKWUUkoJIYQQQiillFJKKSGEEEoppZRSSiklhBBCKKWUUkoppYQQQiillFJKKaWUEEIopZRSSimllBJCCKGUUkoppZRSQgillFJKKaWUUkooIYRSSimllFJKCSWUUkoppZRSSikhlFJKKaWUUkoppQAAgAMHAIAAI+gko8oibDThwgMQAAAAAgACTACBAYKCUQgChBEIAAAAAAAIAPgAAEgKgIiIaOYMDhASFBYYGhweICIkAAAAAAAAAAAAAAAABE9nZ1MABI0KAAAAAAAALzo0AwIAAABOuAKdDElQTElHRUVFRUJCP65pcJYAFEWW/7WG5bI5koaHpnUqRx6fhe4P8RX3uy3WEzjaxgZw5oLA3zZcISIRczlkFEAo1F6Hgcgav7Z0ziAwgKXU3HWSEAC2LLkoANRqefqu5vWJ2RZNnXp+10t7bzAeDC+pOIca7bIfTvlkkrA6TEiz1QWkmKiEWyXN1wz3Tw4h9mATViE9dF1MwOl9FdkPaXZdC/fvAbIrZVEAKBbZzFCr4Wmag/epdbIXZCXnn+E8wsrQB2n7yK5dzqopipF+mb5hV1+Vn/Vom+z2ZccgdLqXK3lDXsvPaGamuqVZdh8oDACyZlCsBkBhIB+Pssr9k8npzTjZx1BdBhCGu1IBScvOpJ8n8hyfRXBRAuY0k2zSvcqb3SmLrKWwnWCoqIGdxEGXWGJzaU9rPUUeqqWryS4AWFBoaXdJkS3jUXLHaNyWVsRXmrubOXmEZAxQXSBcr0MH+pAtaN5V0oTxLZgKKRFMy/f+XszS4Q2njtS9KW+wjQKioRfVGkChSnfUouHZ2G37XA59bbRsDGQDoQ+37TlBSopo6W54UMOEGr7PJMnZkpKy69J2zvo+swNVp00a4yfL/cTlAACenfevSICcgfrySYDklVFrKfeNnhj2ozJJD/OVVNsRpxW2ktEGXXob7fU2696VK2NZ3JpSLZr2tIl2KQ0Mt8ssOLHpAQCeWnlvmZUAAFZUafmlQyLPzLUyvamIKHonIzIIHCeDZd2eO6/G4+xLGY3k6P5cWNDbx9OmV04rQzWwj/j2o7roD0efFwCeWERdqQQAKAT5lksVTigXS9HxXK+odh5b8LRwsiuvqOOaLURmHfDAOE+jfYrvarXskeHRxjzrhLJiE0uDLPFQbGXnIQWWVkVDZmMAAJVB+rUlIWQ4Ru1TUzHaAokPjDhwmHCpn3jXxmzDhswi7gPoYptmnVuBCbW3MgVwmTQuklQr9Ddz3wKOUsW3ogpgYeB/YgffyetmMmV1MjTJIr/V4RTwNOaR+ezqs2FLEMhKYswMTnkoL2hdLdZPEQ+eXWq8VOy1vcX+QwGGTcOdfBmDFKTOTd8vZDj4WcDE70kokkmKDnSQSUmWbCYediCPx2M2Au6PNV6egQqTcXBKNjOTAk7mxXL78gA=',
    win_sound = 'data:audio/ogg;base64,T2dnUwACAAAAAAAAAADEKwJLAAAAAPgqdDcBHgF2b3JiaXMAAAAAAbgLAAAAAAAA/////wAAAACZAU9nZ1MAAAAAAAAAAAAAxCsCSwEAAADO7/ZMC0X///////////+1A3ZvcmJpczUAAABYaXBoLk9yZyBsaWJWb3JiaXMgSSAyMDE4MDMxNiAoTm93IDEwMCUgZmV3ZXIgc2hlbGxzKQAAAAABBXZvcmJpcxJCQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBADIAAAYhiGH3knMkFOQSSYpVcw5CKH1DjnlFGTSUsaYYoxRzpBTDDEFMYbQKYUQ1E45pQwiCENInWTOIEs96OBi5zgQGrIiAIgCAACMQYwhxpBzDEoGIXKOScggRM45KZ2UTEoorbSWSQktldYi55yUTkompbQWUsuklNZCKwUAAAQ4AAAEWAiFhqwIAKIAABCDkFJIKcSUYk4xh5RSjinHkFLMOcWYcowx6CBUzDHIHIRIKcUYc0455iBkDCrmHIQMMgEAAAEOAAABFkKhISsCgDgBAIMkaZqlaaJoaZooeqaoqqIoqqrleabpmaaqeqKpqqaquq6pqq5seZ5peqaoqp4pqqqpqq5rqqrriqpqy6ar2rbpqrbsyrJuu7Ks256qyrapurJuqq5tu7Js664s27rkearqmabreqbpuqrr2rLqurLtmabriqor26bryrLryratyrKua6bpuqKr2q6purLtyq5tu7Ks+6br6rbqyrquyrLu27au+7KtC7vourauyq6uq7Ks67It67Zs20LJ81TVM03X9UzTdVXXtW3VdW1bM03XNV1XlkXVdWXVlXVddWVb90zTdU1XlWXTVWVZlWXddmVXl0XXtW1Vln1ddWVfl23d92VZ133TdXVblWXbV2VZ92Vd94VZt33dU1VbN11X103X1X1b131htm3fF11X11XZ1oVVlnXf1n1lmHWdMLqurqu27OuqLOu+ruvGMOu6MKy6bfyurQvDq+vGseu+rty+j2rbvvDqtjG8um4cu7Abv+37xrGpqm2brqvrpivrumzrvm/runGMrqvrqiz7uurKvm/ruvDrvi8Mo+vquirLurDasq/Lui4Mu64bw2rbwu7aunDMsi4Mt+8rx68LQ9W2heHVdaOr28ZvC8PSN3a+AACAAQcAgAATykChISsCgDgBAAYhCBVjECrGIIQQUgohpFQxBiFjDkrGHJQQSkkhlNIqxiBkjknIHJMQSmiplNBKKKWlUEpLoZTWUmotptRaDKG0FEpprZTSWmopttRSbBVjEDLnpGSOSSiltFZKaSlzTErGoKQOQiqlpNJKSa1lzknJoKPSOUippNJSSam1UEproZTWSkqxpdJKba3FGkppLaTSWkmptdRSba21WiPGIGSMQcmck1JKSamU0lrmnJQOOiqZg5JKKamVklKsmJPSQSglg4xKSaW1kkoroZTWSkqxhVJaa63VmFJLNZSSWkmpxVBKa621GlMrNYVQUgultBZKaa21VmtqLbZQQmuhpBZLKjG1FmNtrcUYSmmtpBJbKanFFluNrbVYU0s1lpJibK3V2EotOdZaa0ot1tJSjK21mFtMucVYaw0ltBZKaa2U0lpKrcXWWq2hlNZKKrGVklpsrdXYWow1lNJiKSm1kEpsrbVYW2w1ppZibLHVWFKLMcZYc0u11ZRai621WEsrNcYYa2415VIAAMCAAwBAgAlloNCQlQBAFAAAYAxjjEFoFHLMOSmNUs45JyVzDkIIKWXOQQghpc45CKW01DkHoZSUQikppRRbKCWl1losAACgwAEAIMAGTYnFAQoNWQkARAEAIMYoxRiExiClGIPQGKMUYxAqpRhzDkKlFGPOQcgYc85BKRljzkEnJYQQQimlhBBCKKWUAgAAChwAAAJs0JRYHKDQkBUBQBQAAGAMYgwxhiB0UjopEYRMSielkRJaCylllkqKJcbMWomtxNhICa2F1jJrJcbSYkatxFhiKgAA7MABAOzAQig0ZCUAkAcAQBijFGPOOWcQYsw5CCE0CDHmHIQQKsaccw5CCBVjzjkHIYTOOecghBBC55xzEEIIoYMQQgillNJBCCGEUkrpIIQQQimldBBCCKGUUgoAACpwAAAIsFFkc4KRoEJDVgIAeQAAgDFKOSclpUYpxiCkFFujFGMQUmqtYgxCSq3FWDEGIaXWYuwgpNRajLV2EFJqLcZaQ0qtxVhrziGl1mKsNdfUWoy15tx7ai3GWnPOuQAA3AUHALADG0U2JxgJKjRkJQCQBwBAIKQUY4w5h5RijDHnnENKMcaYc84pxhhzzjnnFGOMOeecc4wx55xzzjnGmHPOOeecc84556CDkDnnnHPQQeicc845CCF0zjnnHIQQCgAAKnAAAAiwUWRzgpGgQkNWAgDhAACAMZRSSimllFJKqKOUUkoppZRSAiGllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimVUkoppZRSSimllFJKKaUAIN8KBwD/BxtnWEk6KxwNLjRkJQAQDgAAGMMYhIw5JyWlhjEIpXROSkklNYxBKKVzElJKKYPQWmqlpNJSShmElGILIZWUWgqltFZrKam1lFIoKcUaS0qppdYy5ySkklpLrbaYOQelpNZaaq3FEEJKsbXWUmuxdVJSSa211lptLaSUWmstxtZibCWlllprqcXWWkyptRZbSy3G1mJLrcXYYosxxhoLAOBucACASLBxhpWks8LR4EJDVgIAIQEABDJKOeecgxBCCCFSijHnoIMQQgghREox5pyDEEIIIYSMMecghBBCCKGUkDHmHIQQQgghhFI65yCEUEoJpZRSSucchBBCCKWUUkoJIYQQQiillFJKKSGEEEoppZRSSiklhBBCKKWUUkoppYQQQiillFJKKaWUEEIopZRSSimllBJCCKGUUkoppZRSQgillFJKKaWUUkooIYRSSimllFJKCSWUUkoppZRSSikhlFJKKaWUUkoppQAAgAMHAIAAI+gko8oibDThwgMQAAAAAgACTACBAYKCUQgChBEIAAAAAAAIAPgAAEgKgIiIaOYMDhASFBYYGhweICIkAAAAAAAAAAAAAAAABE9nZ1MABIcFAAAAAAAAxCsCSwIAAAD7zdFTBzpHRkRCPTSuLPvLFCwJMsCSAoUH6FZdMR9a+72mK69QNFFR0YSuie5aUyKgE3e/vpIUFwCQu7vDE1zXx54JIO1Bti/7TiRCbgmgAB9EE4W4d+V4YtEIpo1lLAAAXc7Dg3nSM7hce+9GjRYSMrSyI3UXssuNy9qK7m5b/K3CS0dwJALovnYjHgDGNHuXSISIEh2LgZmwABQAE+cRpU05Hgpdf3dVAQAAPrebFdSJ6MD9LZOGuoIAOlrM416AAv357IavLRxAQ1MA0K/9NXcAujL7XiUIroSEBtCNovU72nedyJ08bGnFtuX/JFkFwecVAJK7C74GhqrWHBWfz0C943mljGaJjH3L7C3tAOjj9WDlMQCyMWsmNhOuE9AA2vqTosNDZhZ/TNOX5VfP3W721txp1QDRfioAgIJAX11/2Ji9vyFThMnPPQLjgDW+jQAAsC9ntwGWK6d+G6yT07XlcTypWTx+fOWhpI/Zh5morr+edrqZmOe5s6tXR4AeV+9XYed4V5wDwMLtPpoBAH39/WoCmpC2TUEUACIXAMrbxt2zbZ+7G2A5rtopzge3SxloluPaevJ1GoB8uEw+dALM5w5wsdsLAQ==',
    lose_sound = 'data:audio/ogg;base64,T2dnUwACAAAAAAAAAACvA9p5AAAAADWnjFABHgF2b3JiaXMAAAAAAbgLAAAAAAAA/////wAAAACZAU9nZ1MAAAAAAAAAAAAArwPaeQEAAAC7Dz+fC0X///////////+1A3ZvcmJpczUAAABYaXBoLk9yZyBsaWJWb3JiaXMgSSAyMDE4MDMxNiAoTm93IDEwMCUgZmV3ZXIgc2hlbGxzKQAAAAABBXZvcmJpcxJCQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBADIAAAYhiGH3knMkFOQSSYpVcw5CKH1DjnlFGTSUsaYYoxRzpBTDDEFMYbQKYUQ1E45pQwiCENInWTOIEs96OBi5zgQGrIiAIgCAACMQYwhxpBzDEoGIXKOScggRM45KZ2UTEoorbSWSQktldYi55yUTkompbQWUsuklNZCKwUAAAQ4AAAEWAiFhqwIAKIAABCDkFJIKcSUYk4xh5RSjinHkFLMOcWYcowx6CBUzDHIHIRIKcUYc0455iBkDCrmHIQMMgEAAAEOAAABFkKhISsCgDgBAIMkaZqlaaJoaZooeqaoqqIoqqrleabpmaaqeqKpqqaquq6pqq5seZ5peqaoqp4pqqqpqq5rqqrriqpqy6ar2rbpqrbsyrJuu7Ks256qyrapurJuqq5tu7Js664s27rkearqmabreqbpuqrr2rLqurLtmabriqor26bryrLryratyrKua6bpuqKr2q6purLtyq5tu7Ks+6br6rbqyrquyrLu27au+7KtC7vourauyq6uq7Ks67It67Zs20LJ81TVM03X9UzTdVXXtW3VdW1bM03XNV1XlkXVdWXVlXVddWVb90zTdU1XlWXTVWVZlWXddmVXl0XXtW1Vln1ddWVfl23d92VZ133TdXVblWXbV2VZ92Vd94VZt33dU1VbN11X103X1X1b131htm3fF11X11XZ1oVVlnXf1n1lmHWdMLqurqu27OuqLOu+ruvGMOu6MKy6bfyurQvDq+vGseu+rty+j2rbvvDqtjG8um4cu7Abv+37xrGpqm2brqvrpivrumzrvm/runGMrqvrqiz7uurKvm/ruvDrvi8Mo+vquirLurDasq/Lui4Mu64bw2rbwu7aunDMsi4Mt+8rx68LQ9W2heHVdaOr28ZvC8PSN3a+AACAAQcAgAATykChISsCgDgBAAYhCBVjECrGIIQQUgohpFQxBiFjDkrGHJQQSkkhlNIqxiBkjknIHJMQSmiplNBKKKWlUEpLoZTWUmotptRaDKG0FEpprZTSWmopttRSbBVjEDLnpGSOSSiltFZKaSlzTErGoKQOQiqlpNJKSa1lzknJoKPSOUippNJSSam1UEproZTWSkqxpdJKba3FGkppLaTSWkmptdRSba21WiPGIGSMQcmck1JKSamU0lrmnJQOOiqZg5JKKamVklKsmJPSQSglg4xKSaW1kkoroZTWSkqxhVJaa63VmFJLNZSSWkmpxVBKa621GlMrNYVQUgultBZKaa21VmtqLbZQQmuhpBZLKjG1FmNtrcUYSmmtpBJbKanFFluNrbVYU0s1lpJibK3V2EotOdZaa0ot1tJSjK21mFtMucVYaw0ltBZKaa2U0lpKrcXWWq2hlNZKKrGVklpsrdXYWow1lNJiKSm1kEpsrbVYW2w1ppZibLHVWFKLMcZYc0u11ZRai621WEsrNcYYa2415VIAAMCAAwBAgAlloNCQlQBAFAAAYAxjjEFoFHLMOSmNUs45JyVzDkIIKWXOQQghpc45CKW01DkHoZSUQikppRRbKCWl1losAACgwAEAIMAGTYnFAQoNWQkARAEAIMYoxRiExiClGIPQGKMUYxAqpRhzDkKlFGPOQcgYc85BKRljzkEnJYQQQimlhBBCKKWUAgAAChwAAAJs0JRYHKDQkBUBQBQAAGAMYgwxhiB0UjopEYRMSielkRJaCylllkqKJcbMWomtxNhICa2F1jJrJcbSYkatxFhiKgAA7MABAOzAQig0ZCUAkAcAQBijFGPOOWcQYsw5CCE0CDHmHIQQKsaccw5CCBVjzjkHIYTOOecghBBC55xzEEIIoYMQQgillNJBCCGEUkrpIIQQQimldBBCCKGUUgoAACpwAAAIsFFkc4KRoEJDVgIAeQAAgDFKOSclpUYpxiCkFFujFGMQUmqtYgxCSq3FWDEGIaXWYuwgpNRajLV2EFJqLcZaQ0qtxVhrziGl1mKsNdfUWoy15tx7ai3GWnPOuQAA3AUHALADG0U2JxgJKjRkJQCQBwBAIKQUY4w5h5RijDHnnENKMcaYc84pxhhzzjnnFGOMOeecc4wx55xzzjnGmHPOOeecc84556CDkDnnnHPQQeicc845CCF0zjnnHIQQCgAAKnAAAAiwUWRzgpGgQkNWAgDhAACAMZRSSimllFJKqKOUUkoppZRSAiGllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimVUkoppZRSSimllFJKKaUAIN8KBwD/BxtnWEk6KxwNLjRkJQAQDgAAGMMYhIw5JyWlhjEIpXROSkklNYxBKKVzElJKKYPQWmqlpNJSShmElGILIZWUWgqltFZrKam1lFIoKcUaS0qppdYy5ySkklpLrbaYOQelpNZaaq3FEEJKsbXWUmuxdVJSSa211lptLaSUWmstxtZibCWlllprqcXWWkyptRZbSy3G1mJLrcXYYosxxhoLAOBucACASLBxhpWks8LR4EJDVgIAIQEABDJKOeecgxBCCCFSijHnoIMQQgghREox5pyDEEIIIYSMMecghBBCCKGUkDHmHIQQQgghhFI65yCEUEoJpZRSSucchBBCCKWUUkoJIYQQQiillFJKKSGEEEoppZRSSiklhBBCKKWUUkoppYQQQiillFJKKaWUEEIopZRSSimllBJCCKGUUkoppZRSQgillFJKKaWUUkooIYRSSimllFJKCSWUUkoppZRSSikhlFJKKaWUUkoppQAAgAMHAIAAI+gko8oibDThwgMQAAAAAgACTACBAYKCUQgChBEIAAAAAAAIAPgAAEgKgIiIaOYMDhASFBYYGhweICIkAAAAAAAAAAAAAAAABE9nZ1MABOMFAAAAAAAArwPaeQIAAABEOqKAB0Q6NTM9NzXKbnmqAE6FfUJLAWTVbS5U/MdmfaXsG221Z2PTR7qhqWBbCEelH5VPdoMAGEHt9X9sWTXCvFT9N3DajC+u2TSAKt6vCdavzWBoHCZoa8AYAHhnJ4Cb28GpzisA5HMATv8JAMYRBfgqleGIwJ4WB3xGwNGLK4udqpHI8iuYHgDSbv1cQ+eSguSwAYAfmwL4z14F/NJMBRhmAcSPAlwioItFiAuIibpXYRcqxAAisVdvB0ClBs4ue3wZINkOOG4A4HETgJMDBXz3vQIMGWAX9DfYBDLg9+tZv9vpUjO4GfKwix2ladDRANKrxoaDBtBjAHKQGCkA3J4G4NdxANvZ4QIoJAA4iQDszFKAXZBwq9lbyLOEYQ4/kmp4cTM8LQUjAe6obQDKafjrYBhgCwAcpwGo3dkCsL8dgFFfARBKALenSnirgn6YBgMUf8+pznPji2/Rn2ANHORbPlsDsqF/NQC2BjqnAag/1zqAf344Ccy/+LIDAIB+934VAOs5zZxWyvpQlo5LtwT9WVmTCnAJPwA=',
    air_hit_sound = 'data:audio/ogg;base64,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lAIAAAocAAACbNCUWByg0JAVAUAUAABgDGIMMYYgdFI6KRGETEonpZESWgspZZZKiiXGzFqJrcTYSAmthdYyayXG0mJGrcRYYioAAOzAAQDswEIoNGQlAJAHAEAYoxRjzjlnEGLMOQghNAgx5hyEECrGnHMOQggVY845ByGEzjnnIIQQQueccxBCCKGDEEIIpZTSQQghhFJK6SCEEEIppXQQQgihlFIKAAAqcAAACLBRZHOCkaBCQ1YCAHkAAIAxSjknJaVGKcYgpBRboxRjEFJqrWIMQkqtxVgxBiGl1mLsIKTUWoy1dhBSai3GWkNKrcVYa84hpdZirDXX1FqMtebce2otxlpzzrkAANwFBwCwAxtFNicYCSo0ZCUAkAcAQCCkFGOMOYeUYowx55xDSjHGmHPOKcYYc8455xRjjDnnnHOMMeecc845xphzzjnnnHPOOeegg5A555xz0EHonHPOOQghdM455xyEEAoAACpwAAAIsFFkc4KRoEJDVgIA4QAAgDGUUkoppZRSSqijlFJKKaWUUgIhpZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoplVJKKaWUUkoppZRSSimlACDfCgcA/wcbZ1hJOiscDS40ZCUAEA4AABjDGISMOSclpYYxCKV0TkpJJTWMQSilcxJSSimD0FpqpaTSUkoZhJRiCyGVlFoKpbRWaymptZRSKCnFGktKqaXWMuckpJJaS622mDkHpaTWWmqtxRBCSrG11lJrsXVSUkmttdZabS2klFprLcbWYmwlpZZaa6nF1lpMqbUWW0stxtZiS63F2GKLMcYaCwDgbnAAgEiwcYaVpLPC0eBCQ1YCACEBAAQySjnnnIMQQgghUoox56CDEEIIIURKMeacgxBCCCGEjDHnIIQQQgihlJAx5hyEEEIIIYRSOucghFBKCaWUUkrnHIQQQgillFJKCSGEEEIopZRSSikhhBBKKaWUUkopJYQQQiillFJKKaWEEEIopZRSSimllBBCKKWUUkoppZQSQgihlFJKKaWUUkIIpZRSSimllFJKKCGEUkoppZRSSgkllFJKKaWUUkopIZRSSimllFJKKaUAAIADBwCAACPoJKPKImw04cIDEAAAAAIAAkwAgQGCglEIAoQRCAAAAAAACAD4AABICoCIiGjmDA4QEhQWGBocHiAiJAAAAAAAAAAAAAAAAARPZ2dTAAQ5BwAAAAAAAD/PeQgCAAAAfW5EJgk8Pzw/Pzw9OQ6uJGNoge0TMgVnLbh3Y3lES2t9mImxXLMpg3HRHeCzv9jxuPoUv3epHT3o4bO/GH28M4eFrIL0VoH9UwLGJuNIZoAiAQoVt1JA/3ty34ksDeuwjNxV0o/SDE/1Ygj4lGw3vlB6kCQyzknBEBt2SstMB3VxzxZ4Ia29SgPOpPTt+DIZnhxQN3fmFBKUBzYJhowYHUPq8/4mTuqsRRy7+klWAjsa6aq8ctFIcPDizkIcFsrAt/c3qgCqoGpTCkyQyWlDysuf/rlscSDHY5KOd6YGGVK5csTP/3Hq7F7oijgnSmZ62D2zeGU8TWf/Dw/gOTebkIzyGgCan+ZRi+ADcio21Vmd9x7bbkiBLHaG+BaGwzyrstSKQFeER19ufR3erPe7Mk6lQTNTWSP2zhgt+hcZ48siBgCenMpUnyrQHhTr0fRrLAcoVxCRTpE9JOm0GF0rF9Gw1DvoiqZnvbr2D3XrFqFXVcun7goxRyVAW9y2PgGWmuq9jQOZDL8iSs48X3eE2CMX0fKY/pqzdw+JgeMao2RTKBEP/KkTgIRoolQNpJ6tJKuQUVuk5bzd3RgAilZlWAWAjEqPAQbz/KOpVM4if0DmEiRV4zhS/EnJWyQMTBbal4Lw6vvqW3fmXLh8L1LBFIRwyTIAigv3Od54AAAA4NM1AQA=';

function play(sound, mute_background) {
    new Audio(sound).play();
}


let bow = new Bow(-46, 3),
    arrows_remaining = 0,
    arrows = [],
    level_n,
    level,
    score = 0,
    score_to_add = 0,
    blink_val = 0,
    last_arrow_handler_enabled = false;

localStorage['best_score'] = localStorage['best_score'] || 0;

let GameState = Object.freeze({
    TITLE_SCREEN: 1,
    LEVEL_INFO: 2,
    LEVEL_PLAY: 3,
    LEVEL_PASSED: 4,
    LEVEL_FAILED: 5,
    END_SCREEN: 6
});
let game_state = GameState.TITLE_SCREEN;

let TitleScreenState = Object.freeze({
    REVEALING_BOW: 1,
    FIRING_ARROW_1: 2,
    MOVING_BOW_1: 3,
    FIRING_ARROW_2: 4,
    MOVING_BOW_2: 5,
    FIRING_ARROW_3: 6,
    MOVING_BOW_3: 7,
    AFTER_INTRO: 8,
    BOW_TIMEOUT: 9
});
let title_screen_state = TitleScreenState.REVEALING_BOW,
    title_screen_arrows = [];

function click(e) {
    if (!is_fullscreen) {
        return;
    }
    if (e.which == 1) {
        switch (game_state) {
            case GameState.LEVEL_INFO:
                game_state = GameState.LEVEL_PLAY;
                break;
            case GameState.TITLE_SCREEN:
                if (title_screen_state != TitleScreenState.AFTER_INTRO) {
                    break;
                }
                // no break
            case GameState.END_SCREEN:
                score = 0;
                level_n = 1;
                prepare_level();
                break;
        }
    }
}

document.addEventListener('click', click);

function add_arrow(arrow) {
    arrows.push(arrow);
    if (!arrows_remaining) {
        handle_last_arrow();
    }
}

function handle_last_arrow() {
    last_arrow_handler_enabled = true;
    setTimeout(function h() {
        if (!last_arrow_handler_enabled) {
            return;
        }
        if (arrows.length == 0 && level.can_safely_fail()) {
            onlevelend(false);
        } else {
            setTimeout(h, 500);
        }
    });
}

function add_score(count) {
    score_to_add += count;
}

function score_to_str(score) {
    let score_str = '' + score;
    return '0'.repeat(6 - score_str.length) + score_str;
}

function change_remaining_arrows_to_score(callback, orig_arrows_remaining) {
    if (arrows_remaining) {
        add_score(50);
        --arrows_remaining;
        setTimeout(change_remaining_arrows_to_score, 1000, callback, (orig_arrows_remaining || arrows_remaining));
    } else {
        let t = 5000 - ((orig_arrows_remaining || 0) * 1000);
        if (t < 1000) {
            t = 1000;
        }
        setTimeout(callback, t);
    }
}

function prepare_level() {
    level = construct_level(level_n, onlevelend);
    arrows_remaining = level.arrows_limit;
    game_state = GameState.LEVEL_INFO;
}

function onlevelend(success) {
    last_arrow_handler_enabled = false;

    bow.strain();
    bow.release_arrow(_=>{});
    arrows = [];

    if (success) {
        play(win_sound);
        game_state = GameState.LEVEL_PASSED;
        change_remaining_arrows_to_score(_ => {
            ++level_n;
            if (level_n > levels_count) {
                game_state = GameState.END_SCREEN;
            } else {
                prepare_level();
            }
        });
    } else {
        play(lose_sound);
        game_state = GameState.LEVEL_FAILED;
        setTimeout(_ => {
            level_n = 1;
            score = 0;
            prepare_level();
        }, 5000);
    }
}

let throw_canvas = document.createElement('canvas'),
    an_canvas = document.createElement('canvas'),
    arrow_canvas = document.createElement('canvas'),
    throw_ctx = throw_canvas.getContext('2d'),
    an_ctx = an_canvas.getContext('2d'),
    arrow_ctx = arrow_canvas.getContext('2d');

[throw_canvas.width, throw_canvas.height] = big_font.measure('Throw');
[an_canvas.width, an_canvas.height] = big_font.measure('an');
[arrow_canvas.width, arrow_canvas.height] = big_font.measure('arrow');

// wait until font is definetely loaded
setTimeout(_ => {
    big_font.draw(throw_ctx, 0, throw_canvas.height, 'Throw');
    big_font.draw(an_ctx, 0, an_canvas.height, 'an');
    big_font.draw(arrow_ctx, 0, arrow_canvas.height, 'arrow');
}, 500);

function draw_title_screen_line(index, canvas, pos_x, pos_y) {
    if (title_screen_arrows[index]) {
        let width = (title_screen_arrows[index].x + arrow_width) - pos_x;
        if (width > 0) {
            if (width > canvas.width) {
                width = canvas.width;
            }
            ctx.drawImage(canvas, 0, 0, width, canvas.height,
                                  pos_x, pos_y, width, canvas.height);
        }
    }
}

function draw_centered_blink(text, pos_y) {
    ctx.save();
        if (blink_val < 50) {
            ctx.globalAlpha = blink_val * 0.02;
        } else if (blink_val >= 75) {
            ctx.globalAlpha = (125 - blink_val) * 0.02;
        }
        status_font.draw_centered(ctx, text, pos_y);
    ctx.restore();
}

function draw() {
    switch (game_state) {
    case GameState.TITLE_SCREEN:
        ctx.drawImage(sky_image, 0, 0, canvas_width, canvas_height);

        draw_title_screen_line(0, throw_canvas, 60, 130);
        draw_title_screen_line(1, an_canvas, 150, 160);
        draw_title_screen_line(2, arrow_canvas, 200, 190);

        let status_text = '';
        if (title_screen_state == TitleScreenState.AFTER_INTRO) {
            status_text = used_touch ? 'Touch to play!' : 'Left click to play!';
            normal_font.draw_bottom_centered(ctx, 'Please visit https://github.com/hckr/throw-an-arrow\nfor information about the authors of used resources and the code');
        } else if (!is_fullscreen) {
            status_text = 'Click to enter fullscreen!';
        }
        draw_centered_blink(status_text, 20);

        bow.draw_on(ctx);

        for (let arrow of title_screen_arrows) {
            ctx.drawImage(arrow_image, arrow.x, arrow.y);
        }

        break;

    case GameState.LEVEL_INFO:
        ctx.drawImage(level.bg_image, 0, 0, canvas_width, canvas_height);
        bow.draw_on(ctx);
        big_font.draw_centered(ctx, `Level ${level_n}\n${level.title}`);
        normal_font.draw_bottom_centered(ctx, level.description);
        draw_centered_blink(used_touch ? 'Touch to start!' : 'Left click to start!', 50);
        break;

    case GameState.LEVEL_PLAY:
        ctx.drawImage(level.bg_image, 0, 0, canvas_width, canvas_height);
        bow.draw_on(ctx);
        for (let arrow of arrows) {
            ctx.drawImage(arrow_image, arrow.x, arrow.y);
        }
        level.draw_on(ctx);
        break;

    case GameState.LEVEL_PASSED:
        ctx.drawImage(level.bg_image, 0, 0, level.bg_image.width, 18, 0, 0, canvas_width, 36);
        big_font.draw_centered(ctx, `Well done!`);
        normal_font.draw_bottom_centered(ctx, 'You get 50 points for each unused arrow');
        break;

    case GameState.LEVEL_FAILED:
        ctx.drawImage(level.bg_image, 0, 0, level.bg_image.width, 18, 0, 0, canvas_width, 36);
        big_font.draw_centered(ctx, `Not this time!`);
        normal_font.draw_bottom_centered(ctx, 'You clearly need more practice');
        break;

    case GameState.END_SCREEN:
        ctx.drawImage(sky_image, 0, 0, canvas_width, canvas_height);
        big_font.draw_centered(ctx, `Congratulations!\nYou finished the game`);
        normal_font.draw_bottom_centered(ctx, 'I hope you liked it.');
        draw_centered_blink(used_touch ? 'Touch to start again!' : 'Left click to start again!', 50);


    }

    if (game_state != GameState.TITLE_SCREEN) {
        status_font.draw(ctx, 5, 20, 'score');
        status_number_font.draw(ctx, 35, 20, score_to_str(score));
        status_font.draw(ctx, 11, 35, 'best');
        status_number_font.draw(ctx, 35, 35, score_to_str(localStorage['best_score']));

        if (game_state != GameState.END_SCREEN) {
            status_font.draw(ctx, canvas_width - 35, 20, 'arrows');
            ctx.fillStyle = '#e1d1ac';
            for (let pos_x = canvas_width - 42, arrows_drawn = 0; arrows_drawn < arrows_remaining; ++arrows_drawn, pos_x -= 3) {
                ctx.fillRect(pos_x, 12, 1, 8);
            }
        }
    }

    // if (debug) {
    //     status_font.draw(ctx, canvas_width - 70, 45, `used colors: ${check_colors_and_get_count()}`);
    // }

    requestAnimationFrame(draw);
}

function update() {
    blink_val += 1;
    if (blink_val >= 125) {
        blink_val = 0;
    }

    switch (game_state) {
    case GameState.LEVEL_PLAY:
        level.update(arrows);
        arrows = arrows.filter(arrow => {
            arrow.x += arrow.speed;
            return arrow.x < canvas_width && arrow.x > -arrow_width;
        });
        break;

    case GameState.TITLE_SCREEN:
        switch (title_screen_state) {
        case TitleScreenState.REVEALING_BOW:
            if (bow.pos_y < 142) {
                bow.pos_y += 2;
            } else {
                title_screen_state = TitleScreenState.FIRING_ARROW_1;
            }
            break;

        case TitleScreenState.FIRING_ARROW_1:
            bow.load_arrow();
            bow.strain();
            bow.release_arrow(arrow => {
                title_screen_state = TitleScreenState.BOW_TIMEOUT;
                title_screen_arrows.push(arrow);
                setTimeout(_ => {
                    title_screen_state = TitleScreenState.MOVING_BOW_1;
                }, 500);
            });
            break;

        case TitleScreenState.MOVING_BOW_1:
            if (bow.pos_y < 172) {
                bow.pos_y += 1;
            } else {
                title_screen_state = TitleScreenState.FIRING_ARROW_2;
            }
            break;

        case TitleScreenState.FIRING_ARROW_2:
            bow.load_arrow();
            bow.strain();
            bow.release_arrow(arrow => {
                title_screen_state = TitleScreenState.BOW_TIMEOUT;
                title_screen_arrows.push(arrow);
                setTimeout(_ => {
                    title_screen_state = TitleScreenState.MOVING_BOW_2;
                }, 500);
            });
            break;

        case TitleScreenState.MOVING_BOW_2:
            if (bow.pos_y < 202) {
                bow.pos_y += 1;
            } else {
                title_screen_state = TitleScreenState.FIRING_ARROW_3;
            }
            break;

        case TitleScreenState.FIRING_ARROW_3:
            bow.load_arrow();
            bow.strain();
            bow.release_arrow(arrow => {
                title_screen_state = TitleScreenState.BOW_TIMEOUT;
                title_screen_arrows.push(arrow);
                setTimeout(_ => {
                    title_screen_state = TitleScreenState.MOVING_BOW_3;
                }, 500);
            });
            break;

        case TitleScreenState.MOVING_BOW_3:
            if (bow.pos_y > 80) {
                bow.pos_y -= 1;
            } else {
                if (title_screen_arrows[2] && title_screen_arrows[2].x > canvas_width) {
                    title_screen_state = TitleScreenState.AFTER_INTRO;
                }
            }
            break;
        }
        for (let arrow of title_screen_arrows) {
            arrow.x += 2;
        }
        break;
    }
    if (score_to_add > 0) {
        ++score;
        --score_to_add;
        if (score > localStorage['best_score']) {
            localStorage['best_score'] = score;
        }
    }
    setTimeout(update, 20);
}

update();
draw();

