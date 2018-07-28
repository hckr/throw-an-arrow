document.body.innerHTML = `<canvas id=c width=360 height=400 style=position:absolute;top:0;left:0;width:100%;height:100%;image-rendering:pixelated></canvas>`;

c.addEventListener('mousedown', e => {
    c.webkitRequestFullscreen();
    c.requestPointerLock();
    unmuteBackgroundMusic();
});

let ctx = c.getContext('2d'),
    canvas_width = c.width,
    canvas_height = c.height;

let canvas_real_height;
function compute_canvas_height() {
    canvas_real_height = parseInt(getComputedStyle(c, null).getPropertyValue('height'));
}
addEventListener('resize', compute_canvas_height);

c.addEventListener('contextmenu', e => {
    e.preventDefault();
});

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
    }
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

function Level1(onlevelend) {
    this.background_color = '#33f';
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
    this.background_color = '#33f';
    this.arrows_limit = 25;
    this.balloons = [];
    let modifier = 100;
    for (let x = 0; x < 200; x += 15) {
        this.balloons.push({
            x: canvas_width - 20 - x,
            y: canvas_height + Math.abs(x - modifier),
            speed: Math.random() > 0.5 ? 2 : 3
        });
        modifier += 15;
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
            --arrows_remaining;
            bow.load_arrow();
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


let bow = new Bow(30),
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
    ctx.fillStyle = level.background_color;
    ctx.fillRect(0, 0, canvas_width, canvas_height);
    bow.drawOn(ctx);
    for (let arrow of arrows) {
        ctx.drawImage(arrow_image, arrow.x, arrow.y);
    }
    level.drawOn(ctx);
    ctx.fillStyle = '#e1d1ac';
    for (let pos_x = canvas_width - 7, arrows_drawn = 0; arrows_drawn < arrows_remaining; ++arrows_drawn, pos_x -= 3) {
        ctx.fillRect(pos_x, 10, 1, 6);
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

