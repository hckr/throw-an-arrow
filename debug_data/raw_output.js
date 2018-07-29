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
    ctx.drawImage(level.bg_image, 0, 0, level.bg_image.width, level.bg_image.height, 0, 0, canvas_width, canvas_height);
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

