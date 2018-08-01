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
    switch(e.key) {
    case 'd':
        debug = !debug;
        break;
    case 'n':
        onlevelend(true);
        break;
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
    return count;
}

let audioCtx = new AudioContext(),
    source = audioCtx.createBufferSource(),
    byteString = atob('T2dnUwACAAAAAAAAAADNvMJhAAAAAEsBGv0BHgF2b3JiaXMAAAAAAbgLAAAAAAAA/////wAAAACZAU9nZ1MAAAAAAAAAAAAAzbzCYQEAAACN9vNuCzz///////////+1A3ZvcmJpcywAAABYaXBoLk9yZyBsaWJWb3JiaXMgSSAyMDE1MDEwNSAo4puE4puE4puE4puEKQAAAAABBXZvcmJpcxJCQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBADIAAAYhiGH3knMkFOQSSYpVcw5CKH1DjnlFGTSUsaYYoxRzpBTDDEFMYbQKYUQ1E45pQwiCENInWTOIEs96OBi5zgQGrIiAIgCAACMQYwhxpBzDEoGIXKOScggRM45KZ2UTEoorbSWSQktldYi55yUTkompbQWUsuklNZCKwUAAAQ4AAAEWAiFhqwIAKIAABCDkFJIKcSUYk4xh5RSjinHkFLMOcWYcowx6CBUzDHIHIRIKcUYc0455iBkDCrmHIQMMgEAAAEOAAABFkKhISsCgDgBAIMkaZqlaaJoaZooeqaoqqIoqqrleabpmaaqeqKpqqaquq6pqq5seZ5peqaoqp4pqqqpqq5rqqrriqpqy6ar2rbpqrbsyrJuu7Ks256qyrapurJuqq5tu7Js664s27rkearqmabreqbpuqrr2rLqurLtmabriqor26bryrLryratyrKua6bpuqKr2q6purLtyq5tu7Ks+6br6rbqyrquyrLu27au+7KtC7vourauyq6uq7Ks67It67Zs20LJ81TVM03X9UzTdVXXtW3VdW1bM03XNV1XlkXVdWXVlXVddWVb90zTdU1XlWXTVWVZlWXddmVXl0XXtW1Vln1ddWVfl23d92VZ133TdXVblWXbV2VZ92Vd94VZt33dU1VbN11X103X1X1b131htm3fF11X11XZ1oVVlnXf1n1lmHWdMLqurqu27OuqLOu+ruvGMOu6MKy6bfyurQvDq+vGseu+rty+j2rbvvDqtjG8um4cu7Abv+37xrGpqm2brqvrpivrumzrvm/runGMrqvrqiz7uurKvm/ruvDrvi8Mo+vquirLurDasq/Lui4Mu64bw2rbwu7aunDMsi4Mt+8rx68LQ9W2heHVdaOr28ZvC8PSN3a+AACAAQcAgAATykChISsCgDgBAAYhCBVjECrGIIQQUgohpFQxBiFjDkrGHJQQSkkhlNIqxiBkjknIHJMQSmiplNBKKKWlUEpLoZTWUmotptRaDKG0FEpprZTSWmopttRSbBVjEDLnpGSOSSiltFZKaSlzTErGoKQOQiqlpNJKSa1lzknJoKPSOUippNJSSam1UEproZTWSkqxpdJKba3FGkppLaTSWkmptdRSba21WiPGIGSMQcmck1JKSamU0lrmnJQOOiqZg5JKKamVklKsmJPSQSglg4xKSaW1kkoroZTWSkqxhVJaa63VmFJLNZSSWkmpxVBKa621GlMrNYVQUgultBZKaa21VmtqLbZQQmuhpBZLKjG1FmNtrcUYSmmtpBJbKanFFluNrbVYU0s1lpJibK3V2EotOdZaa0ot1tJSjK21mFtMucVYaw0ltBZKaa2U0lpKrcXWWq2hlNZKKrGVklpsrdXYWow1lNJiKSm1kEpsrbVYW2w1ppZibLHVWFKLMcZYc0u11ZRai621WEsrNcYYa2415VIAAMCAAwBAgAlloNCQlQBAFAAAYAxjjEFoFHLMOSmNUs45JyVzDkIIKWXOQQghpc45CKW01DkHoZSUQikppRRbKCWl1losAACgwAEAIMAGTYnFAQoNWQkARAEAIMYoxRiExiClGIPQGKMUYxAqpRhzDkKlFGPOQcgYc85BKRljzkEnJYQQQimlhBBCKKWUAgAAChwAAAJs0JRYHKDQkBUBQBQAAGAMYgwxhiB0UjopEYRMSielkRJaCylllkqKJcbMWomtxNhICa2F1jJrJcbSYkatxFhiKgAA7MABAOzAQig0ZCUAkAcAQBijFGPOOWcQYsw5CCE0CDHmHIQQKsaccw5CCBVjzjkHIYTOOecghBBC55xzEEIIoYMQQgillNJBCCGEUkrpIIQQQimldBBCCKGUUgoAACpwAAAIsFFkc4KRoEJDVgIAeQAAgDFKOSclpUYpxiCkFFujFGMQUmqtYgxCSq3FWDEGIaXWYuwgpNRajLV2EFJqLcZaQ0qtxVhrziGl1mKsNdfUWoy15tx7ai3GWnPOuQAA3AUHALADG0U2JxgJKjRkJQCQBwBAIKQUY4w5h5RijDHnnENKMcaYc84pxhhzzjnnFGOMOeecc4wx55xzzjnGmHPOOeecc84556CDkDnnnHPQQeicc845CCF0zjnnHIQQCgAAKnAAAAiwUWRzgpGgQkNWAgDhAACAMZRSSimllFJKqKOUUkoppZRSAiGllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimVUkoppZRSSimllFJKKaUAIN8KBwD/BxtnWEk6KxwNLjRkJQAQDgAAGMMYhIw5JyWlhjEIpXROSkklNYxBKKVzElJKKYPQWmqlpNJSShmElGILIZWUWgqltFZrKam1lFIoKcUaS0qppdYy5ySkklpLrbaYOQelpNZaaq3FEEJKsbXWUmuxdVJSSa211lptLaSUWmstxtZibCWlllprqcXWWkyptRZbSy3G1mJLrcXYYosxxhoLAOBucACASLBxhpWks8LR4EJDVgIAIQEABDJKOeecgxBCCCFSijHnoIMQQgghREox5pyDEEIIIYSMMecghBBCCKGUkDHmHIQQQgghhFI65yCEUEoJpZRSSucchBBCCKWUUkoJIYQQQiillFJKKSGEEEoppZRSSiklhBBCKKWUUkoppYQQQiillFJKKaWUEEIopZRSSimllBJCCKGUUkoppZRSQgillFJKKaWUUkooIYRSSimllFJKCSWUUkoppZRSSikhlFJKKaWUUkoppQAAgAMHAIAAI+gko8oibDThwgMQAAAAAgACTACBAYKCUQgChBEIAAAAAAAIAPgAAEgKgIiIaOYMDhASFBYYGhweICIkAAAAAAAAAAAAAAAABE9nZ1MABL9FAAAAAAAAzbzCYQIAAABa6kDhRzspKjEuLDUrLS4qKzUwMDErNzg1Pi8tOjAyNS0wOi0rOSsqOCwpMyQmNSksLy8uOCwwNS04LDc/LzE5Lig8LS5ANDc+MzIt1mfRMQNUwGNEoQsalnivo0Lt/bsWRQEQzV/fdKLoa0F9nH/eGtuXJ6jr/suGeBx+FAPbAX9zsziYDQPOaWGLoSPAo5O4FaC+TQFYmgCgADXYCfASQBWUAfgGS/gEFvxOkgcSAM5o5ZihI8BjRG4F4Kk9ACsVABSgPB3AVQXw3WAkoCBBCp9AgJUkZUANANZq4TFDRwA0CDg3Ac1n4xLgZ1/A64MRC/hhA0Dogez1hX0sR44AgNeZhwR4ACyrQAHWa9eMAVBAw4EbE6jV822luDzaVGs6/LAAAACMLQD+1A6ABwDwFnwBaFjgC4AGzqrJMEMDOmgQcGYrwHzfAfgOgEhEAACApxYAf28vAA0AfpWoIwMAFljBqAPSaccYAx47Vo0NCQJthXJ9bSux0DfRgtr92jWP2/9fuuINIP7olx3wzGeAsYCNwt8yUibWAMapbveHyaNwiQ1AQtsC4DYK8KYA/q0AvtgoOACc2APgqMCMIGjwWQALHgLGaVs4wwQKl9gAJGwLQLBRoL6tAH4iAD7vAQCAE3sAXPTxCh4afAZYcEYBCgDWacGcAQCJi9wESj4fSwI19VIi2ZOBwnVXM9iSv1nW9CqN30lS+FeDBl0OCqABymhBZuhIIOUAIrcCEBGAN4sClAUARAFQAH4KAAMBHZKk8AlkwDdBAAIAzmdP2NCRQMrhQeImAGovAO/6KFAtDQAiCgAA7cZRYJhAiqTBZ4AFdQJAAtZq0XlDQzIIGg7YmEBs+7Y5Q9xLB1TuvGq4wjCtQM2jQs7nV8QjRBEAftvw0HhBQIDvGsAE1qrkucQgGBwAsCmVpjMTAABABsBPDABcAQAAfxMGwOOJQCtYVabysAQKFvhMAAUAzqmB4QdjAAUAORzQ3ATKT2xUFXatADwZKiGObVbEMeAA+FMbAJpY/cDQQkKNgYAE0qn+sYcCdAQKAAmbAMNlC3j0HbOy4Ldf7RF8fLQEEMDjejpXABSOwAb4rhMCbEwgAMppyyHDINARKBBAhpMAfmIVgNtdAL9tD8BYBACAxR4AR+EKfBZAg4cCFADWqMTqYRCAQIEACSuAP9oKUK1prdbb2BDCaGLXFHBojTqzF6AUw+DUCGgUuE+Eug6wvybwViEA2qnE+qEgOwhO4EnFY3za545CzdOpbKbGmwwMJyebGWjgUr4KdPKa5hmm4QuDzOa9BmR6C7yKpgPOaEFnKMg1CE4QbQH822bPABaLspHgTYB2fGUKcAFeylcFNN4FoNr4whBeEzOBO0kCnAIEANqo7YEGCE5gCechDAUe0k0cTAkEYfvxC4cIBA+XELhMPUpofBbquq7xQOoLjbbMPyTOE+O9kw/9IKvgHQsA1qv42tBA4hBFnKrAfH96fJHBlTg51XMSAMa6IaBmUhHwdoA2CIDXiglsFVQACgDSqv7hA9A6h0jCVsDbtut1tNByzWK3CvYK+LgPoAIoD7icAT4F4KUI2AYNoADWqsTYMEHBIQrc2oCw26+lhCC13lW+45ASBPXFJgjyPPRTsamD36aGuq58vqxedcDH/qLlPpSB01gCyiz6DNQA0EUhvQIeNYfpykuqApz1E4CxHV4Adkpgltb3YnDiJC4HdBlA0QmUG8oAvmn5WCdUaVglWBgXANBOQCIKTvY433pNIgLmuJWk83ZIbEUAfz0LYgm7CnmC+lqhfwDGa0SymtBoOGBj13AaoX7bXXcBAQBY2SsAgNyTAYyn3v7m4153PD47gWtlmPC7jpcAbwEoAMKr12EJFcDpFEgQPA0AOKf9xwIAPLEq4Ce2Sn/Ae4B0CrAHqAINvhEHVIAhAMIr9FpCAZxJgYTIbQqIkXrWr9PJAsDcFsC/u9AH8HXATgFWUgPA9oDPBLg3KIMCAMZqacQSF4DTnW7sVNRRWf3oa6ehHGBkD8DPvuQHH8cHmn7SAMAV9ZTgIaHjx0nPgG+KEwD9+SQDFAC6rNdaQh2ALJQAYExUAGDsGQDgnS0ARMavw6iBCgAAEGAAwG+jAYAAqL8SKAC2q+tpCRUoILQUMDxVAYD5XgQA/EQBAOoN3h4BAADsgJGAn0ICgIDmkhgCxis1fQkDoIDWAd3YeYGK5oOvbU1RAF+zUVFRVFonUctL0ByPLFEAOAPwdYCdKEoAmAmAa69FYAgAwiwUnwAeQAENB8y9AADy8gYA4CsbAABfAwDwbxMA7DmA8zJcBmCDwQFDAMKp97eEAmA2HLCQTgGA5b0DANy2AwBo6QAA/AQA0KcAfiV0ADthMNACAMaq/1jCMIA+ADwQgh2ISszD73dWMzsAZg9A7v1qmdhuAgB8bgAApJZ/TpsdSAKfwi03RBgqtAAAwqoi9BICICYFDyScDgAIUyfiIQDUtwFQ331FbYBS6k0BmJMAWALKAIAaFAC+Kml5CQ0goOBBxCkKAOxJAQCcAMCZvcxnATWCNwUgKIwAygASVGEIAMZr+NISEoC2ABhuhxbglZnUDACLCcCTbXBhmRykJyIAANg5fAUYwNVpcQdAFaqwlRwYAr6s99YJFUId0PI0AAD5FQDgyY0AAAAwlwHUgAa8IwD4MWAIAL6r1+qEOrkdoDVpFAAqJjMAvPssAAAAnJcBHCShd+BvAAD7D1AAxivyeaBBATmAMenLtYg1350+ahYAnM9dS6DY6Uly+zi41qcLcYBywYs+8K4IADwAL9MNFAC6KmQ+AVyAArPhgJmNEgCI/1oAwBEAAE0DAOCPJgDoBwBvRRgCeAGDBboqCSyhBgU0HASeUACKUf8VAOBnPQAANStINQT8UQGASQCdxAZfACABg6ADvmuouk7cJLQUMMxTDSDjv58dSZKRPNGJZJhUADrFW6ET2CkJWIJ+FgYA7IDnlQTCq/cqAegLhDpguLcUwQYp4pXzhipi2yVsEQAAYGEa9Jo/UocCTJEbALDBm0l0AMar/6FBEhoDIYDWSggCbT21JQA8fP9HtQaAAwCaXhAAUNexC+AvKP8EEAD8AgDOLMZrMKEO5HQgirMVKuf85IGcAeJkmj4CABUhw/jw5GZEAeIC+efsLZ7utBKgTqDzKcgJE4ANAMJsKKolOgSQM4EgpigA5JEAAFutAAAAAHEDAGAHvObASwP4GPBpkAuzBBAAwiz1aglQgHEAQOApAOC3vgUAvDcAAN5aA+DkHwcALgSA1pLpAgCMAMjgP4OI14YOxmlEuiUmNMAGEIV0ESCOPz8rAYCdDAD5WVAAAN71RwGAhw+ngX6eOwcgTwO4FBNyYJPFIADGaERSwwoUSJC4vYKK5nebvUEFAIDBDgDgT0X09tYFANfPHAPQBYAyzMoCfArGKTW5E48ECRVtp1Rr+LuHGwAAQLZTAGDKAOREOPrw7//HzQAAoMBFL32YCAB4mQFbBFjh/w/AEMJsKdwSHRoQWgoYMxUBwE2yAPCpAQDvCoX84ZUIAADgJcA4CwAbGgBfCaAAvqxiZImHgqNtAXTj5QDsfQ04stfvVQEA/1mQXT+YRiwAIANPrnkoAyTuPwOgC3+zmgBtX2sABcorZtdg4gADABC5bVMI1N80vQ0BXm4a1dQD7WBRIHy/f/n/1oYD3EiB/DDK++IAjABwD7bE7jTI1SWsnIYlAMItw2KJgwLkHCCR0igAfF9EAOBXBABIKkDOvzoRADDhVpUDlwGwAD0VSOxTgAQAvqzmkCU6AMYOQMDxFAWAsC4AgL0FAFhMAGD0IABABgAY0gMAOwEAoE5An4GA1xomAMorRjUogQaMCSCgC7bqNJd2Mnm8NAAcagDgKaEQAD8kAEBroI6Odrd3XRpwOQUALAw8RCTxmht9AMLoggVLPADYOCDxdAAQRvcqAOB3kgDg7xsAAP7UVgGAWx4D8gsAlzJAEeQAWAPGaGS9HA4UABK3LyAqK8skAADAW38AQMPpWVl7gEtXAJQBO0AlgDEAzmt+osKjrQBj+rs0L5WXErIKeHv3b0elAKApcG/r+44AcFx7nKT3SJcy7GPC9nuFA0DiI4E+8nklcAoAvmyp1BIHJsg9YHhQADh9kR4AgFvpFODEpPbh7T0AAAjkhDbgWQgAeGArCXQAvmuouiU6KCA3AcODAsDoXzsAAH9iBeDRxF/AaloBABhwckAZMJECAB740wEdAM4r+n1QAKRcAwRu7+Wo6K+0vaHWXVjixIEC+I9tznT52wPPX4+id1IUJJNvrCzNdd5qyQv4G/FXY4lfD1YWOgC+LHWxxPQ0SKMDAF0ICgDqSr0J1K0MAIzSKQDMvwQObIAIAOD2CgAC/00DMCji1UfgNQkAviz9YokOcIwHADaAGBQA5l8D3wpMmQDgP6wAwM5Q8NwOOAEAWOwBAOBNAADmYMZXAvgLKAMAAM6raHrQQQO5B4yxDyoqmic1JdEuOfhhPtqKAgehRotq4svktMOpAahb6SdLiyS2XJk14B+4VgTYk+czqP4ByqzNs8EDoK0Bw+1ba4qHW5+ulAKttfbEFkAWC3ocLn4qAB5C6IAsJ8AI4CMBAAI+MGACxmt4siUmDtA6YPiMCACrZDIC1I/oChCv/lAqw+ktAYBooYH9mIAGeAN0QiCPhwSvoAC2aN3Q9NwOMIYYj/YBAOYd4S+KYD++VMFpJYBdjFsA/joNdOLVMBLwcRq8UQA='),
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

function Bow(pos_y, arrow_speed) {
    this.frame = 0;
    this.state = BowState.UNLOADED;
    this.pos_y = pos_y;
    this.arrow_speed = arrow_speed;
    this.pos_y_min = 0;
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
arrow_image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAFBAMAAACz2AE9AAAAElBMVEVjb2yzekHAhkmVlaLh0azs3LchNeVpAAAAAXRSTlMAQObYZgAAADZJREFUeF49ikENADAIA0mmoJsCULCkFkAC/q2MftbH9R5nXaYtDqoDwCF5LdN3uJzjSuT63z/I6QXjEQxUpAAAAABJRU5ErkJggg==';
let arrow_width = 22,
    arrow_height = 5;

let balloon_image = new Image();
balloon_image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAoAgMAAACDXzJIAAAACVBMVEUAAGcAAAD/AABz6q9GAAAAAXRSTlMAQObYZgAAAFJJREFUCNdjYFjAAARMK0Ak1yoEqbWqAY1ctWoBMsnUACK5ICQDErsBIYtMAsWB5qCQYLvgJNANTECjA8CkAAMjVjKAgRVIOjCwwEmICDEqQSQADn4qw55gBtoAAAAASUVORK5CYII=';
let balloon_frame_width = 10,
    balloon_frame_height = 40;

let sky_image = new Image();
sky_image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAADICAMAAAB28zu6AAAASFBMVEVCquhut+Vmu+9xveuAwOl3xPKHw+eJyfOOyu6WyumizeeV0fWrzOKd1POo0+2n1faz1+y61uew3PbD3+5UsutQr+dYtu5gt+oyQw1wAAASS0lEQVR4XrTVUY7DIAwEUB9ixtz/pitVIGMGSp1o5yMS0JAXA6mZcYRGs3EdTZsH7TNu1Ngn0eQxNoe29HbC16yCod1FblHzPStIzbfQGPeVnreVkHX10tn5F3UNTdv6rIhWc0DuaBbVPOjsGZqsoiOsqQ+O+iaTeWvqtylNYdyiOau/4tmvrAUgACB/dYr7gylhns+O8WWtg4eRhVJRS5/8pF+UPXpKZkLVpVmMat5uuQeVBrcBFD3ExudR9HFz8+cdDUUDvd+M/5b3nw4sIQCeEkN4jb6rse37COEO+CLfJ4besX80x04QBby15k3REFk342AGHqv5BQ1AzGifrOp+6ZBoxlzEG3SW6/IRog+1e+vxXOmOxCSMtyG2i/Z4jxAEoFJd1KhzZg9bQg8XxoBMxqQGKugxLSOjShkNQWOXECAlu9QM3OwJ3dnyzhkNRTf/Fc0B7wVfn8n0Yne3/BozVdB+Rw/efqgbtdK97/ztsgUNXNAhaCkHM0ho5HVWc0brWT2jCVCOTRj8qFatosM8f8X1wKKIjnZkQiGjHYUQHDbMckTiMAVDImhc0HRFF+HBUXQgz2gzOfiu6FQYZDVehIianounWdCAf0EDFHUJSQBU+k6d7xJ0IsEPC8X5wU+3hxT1WP81ZzQSGjN6sdfQ9RTQ53Ua9IH2PdoLpS6mhM7/Fg1Iak9ed8f/pYCOEv3RWgc4kcMwFEAnicnU0dBmoRvf/6Zrpx48qQkLCD4ioKqVXq0fpQQhAATaI0RRG1q9rQ3qX3iDT6M7myADYs78m9ICICRhK+zwOnT7cbpDT0cdI0G5cUqpdV03XK6xa0iVnqwXdf1xtB9EOx83CRYx1z9HKqshGdZH0Rbnbr+EtkkDslnQr0dEvdBOU7WRZ+r2Xf4c3YZBExYGVzFr1m1bUoqONs1U9vXyvIfuNXxEQ86FwZJXU68rQjL0d+H36+0LzRH0PjzV1GEfI1nGfJgttdYVIBLNiUQ0RavTNqssVqsPyaK62BOH+M3R76CAt9uJrGxcrk9pdI7o+ajFpU4mNheBfKDeL+4xMvQegQdtcx7UK+ICdGaSN9P96rnMHk3G/qgwvR4PcKJHdIIig+5x6A0X2Y7CCoEXjUENMaIVaj4zE3m0zn5An+fc0dTRLeXbHC2jXnKiRgBBzU1/bNBeLYDJPpCc0TZDhzYyqVsHXc18Rh+zDsAJdEffo8M2s1FmZI1Daw/O6H2cs066pYXN4lWyUyMi5MzoRJKnFGMkkjdQw2lfWkvHHnv1aPbo3dD0UEKCcMXDrPHqDTmZA8DctCyQUgopkhEG21BqF1K2b0cn+nqYWfWRKVjUPEOXbeN5V3aLduGKAycF6wn5VvMyluJYh1qb2WJHz8XMVr0IkLAUKfRdKHivFnGtrytrc4KFc70yPCSyePQQu+Uz6G5vMmkXQAbf+iZUstuNelnfCpnLZpS/24YZPFrj0V5N3iyx76KLL1aL+fiqc+ZpWapoEfH5GTdpOqRJP5ykkVO7QbsXvrTd7eCEanboKXxl88YFr70ymANZht3iJEr2aG92aDJ01M+6d82VWdWj6/a8rS9V/nsRNAQIA1r35hxNhrZjaIpmNVGLkRQdE1ozPHot5V21bMnDX+WektOATilaW/9XD8mZbJeoXYjXKNEDIUYogp6bsaPdsf7Gr30pthn7JCSCdhg1k6uLSzfrpOkfp/Wi4yYMRAG09gwEW8gFtSr//6edJ2OvQ7Taq4gVUGdPbidessTePeeV0R3HpsLRhdGW83iYcVqwAtzorGjQric0ZTp9TqAjsJbaommCehxd2xm3+HC+VRekInQuIAG/gOf8Ce11u/kzOo/BlVgMkQrZxVNsEXSpwjwi77o+K3q9WcDMztlHtkOP29e30Nc7dPP/d1K2SrnRZNauz6PL2z+Y5YWIC0FJTAFRGynQ41Z+fW888hjAlefDJQeTS3TNRW/6qY4h79S/S0EEELP80K4/i76Dvma0qCmkNjQp6840PtG0Rid0aDIzTSZ+fkQ5C1JkNDxpEsXGEc3/BF0ETVGzq9tt3kqVNP0HtT0UXuW5FRlrr1ltSpIw+DsznWe0VB0xJwH3+2Rd5QofBC38nczaN8dGZOXgMCXjgLBT5AJQ78/Qa3FLiVQBVjFvA5ricy/g7lmrqJoj6r5q75ePZDb1z9GrO0uvViY7/K6Tlb8fHDEb+6xrqAUd2573e1EC8CS9ZnQEcfUE2p21xskwPZuwJcOOcu4d2geEq3XzlOtxUxnQc9Wh9tjZ0GtrYY6rtl82+fEVLV1n+7ZdkxngSX1xHtEAGOr41nXNC7M2jpr95j3meqcJ3mfaqwZGSyZzIjRPzyP6+oBmNcrRRN59uMo9Gdu2ejaCxz1l19KZEXT3cPCARqAg8u1H9PUJjTfaawq1mGPTUDOOX99ImAM9lcx80G6wmw8bIjXnj+gFJS6NE3RTUZ2ZA3Wrn8wInDyb878L7Z0TGYbZsS3xMxqgc0ZCtQbaB1bXxBQxV83YJ6UJ7Szc9ipqhK+ipFfUTIcZvSxLDvaM9phZghArVvSbShjR2vRkJlU7z4O3y1Iwpx4sE+VsMj+jAZ8zoNmIA5rV4t4ezNrZOJAL2l/Sc6dFqTMj0svUl8XQsZ4CWjVYEgRYbaG2qz1ayvYMnx68aE6IZVVltLoLJkgxqr6S0Z5fQgU3SxTh5JQwYjxGM2pGd7uNdZsw6cLZbKtepR36eM70nVamJL/Xpi+qHtCLXF0sruWwWxAD+n47sMwbDt8Us8bM436HL8q2bWT2ELqWwp2Q2UeQ9JCJMaIpwOZQJ4nawdAOjKQ0oV0tZqlTQuxpv4PX9tpKbZ2ZG+cH4H1neGyb7K+Ys6HZPIUuiviuWxWD0OY91BFV08LsQjq+KXqjhNYGRHP4g7Gw9WMURecnNKuNk+RlSu3NzS4JNHdqai7X0Ab1ov/Tanc7bsJQEIBpjONgUceoF/v+b1rP+fGIk3Qj1HYktILl4vPRiJD13ixoxkYz0ch8T6i7535LN+n2W7T8ZpKTzTr5Y8iDs5fpAwe7tgtCon0RRG+NZgRmTXtF47PK0W8HTc8cuaHDT6Jt+h5rA6N6mvOoR5vk+KfZPt8h4XX1un476QCHfGpA4injaOZsvpmZaH4bnuh9P2QNzdXYynT13dBUBzSBhqaZNpq/wA9eil+T8IDerRiccwdaFtHBNvSIoB8oiNUjhiQnQM1LwvNzTjhmWGmOyWsplYXmoLuiMWt77xpoHTbe3leiQ7yvUz1ddH5WI2dxyinR/AA6qDv3Gg4dNNCIoh9j1AvLEdXBQpZ+8GegPYkL+VNyEqk+hXJGo9EOz7sNkg60jxrqbajLmPRXRPNTEfiIzlnIyjyRQOb9UQznoBagpc4ox96ZSEZ6b6q25mANj5JzrEeMYE7oDOCNjeDs7UriesKC8WkCNpqx3bfam+x6NKrJlgPqExrq+0DnT1GLmnT41h1WxteAm+WGMxnVELNH5zekDYmjxkkHGuoBZamHf6jXJX1Ge/RUidmUybuRvT5A5/jFAoebvadubr3hkcHI7A9vCG5lZNhAf1bLYbEu4Jo/aKwaya/ggsdXmmk2MdAeRVslOrfKwN4NTfaSrwaPDfTazw3LhVFMNcwY8TBXzNUyzYL2RlhlDu5GndV1uW6WKsPB5Iiebr9txYwH5qc2OKi10UrkNUwbctRZc2iuo9XMUb8GS+KYfdCyecBQLRtPEttFpdrgIwF9u4hOYL+jUm3ozKyoRQRz56kfQuOgGVczQANQrkw6yRETq3K+54FxhgzkoejaTKOD/oyGuFyt9WvSt3cVPLaMKgeidW11ez5rj+hKdlB7p0v5zKbucvAiL0qPdpWvck9UB2SaK9XdzJ1oJRck/6fw30cQ6QTVugfsG9t9mqnulrnwvuTCvGP//VLWTQx7n1O2rmoMbRWnmWpUSy7a46MtMmXm35vTChQMhm71CbSZj7ohTWc4yVTLy0erXHjfl/ybUnvdcRsEogAcyY45U5Z1q77/u5Yzlw4sdpQcWWgN++PLCAc7uMyZoeUleu9H0bw2u5ouf5lP1xOdIrHZ/tvApyzxlV9MzV9EHmVBs3kHTWuB55a9HyLBTtb5HWuLozqXMDVCtyl7A3gHhPVm+HB7LOjZPKPnEwwRAbv2C7REOslVQqVFjMiEeIyb4aVmhOjVXIK7zPJ7c8PdPDlkiqOmcygtd53y92K42uv8Gs3Y3wmhaTELj7O1BstPdrFS53aHuQAE2dHad4SZCbQgt4sDfR2FRdJcZrRT+sV1Bjo/Y6y1B61KEFGvHIgQllx6F7TWJUI20bfqy77gQzLfRItAk2iaDe0MN+U0wJFoV3obaK+y2vWcCTTKZ0FrZ18E3Ex1axKV5uEhfldEogFQPyedU6kBIoFx3NDo+QQMSDu7eUxL9JLdEYMrfRiZDqYwJou4d8sNn/1hZnxk7sLJ7LWud+oRHZxkmy7U62fLfRNT789HQa0fmqWjRy7XBbKt1ljp+48saMVmsv8qW0fT/BFaWGcyPXFZ96uxidRL9VOLuF3Ifgi9417NB9FHVTTeN9fWI/4WBdvMyQGgCtsy0p9Uj+jjPguabfD1qaijoXHSO4U+5S4stb1JzUkvFdMXP9GL+bVfkr/lPYKiQ4330AJMdwsj2vF2aUoto/pi1hbmP3sczX1hG0lyKYpOUb21BrrSebgUghkdepvxghAnzlT+uo4PuNRg2zPtwpRylGE5Lo6mCMyqRoWO1RjQ/4+bgsxkDnlFmUOoo5kYpmXvdkWp2eA6O9Zbo0AjM5FRLaihBtFwtPnZ6ytOS3KaMt0gPk/NnGrHs+xW+3+81+Fq5DAMBOD8aC86BiHI+z/sIWRHcix7c2ncIVCDze7HYNfZfZiIhg4R0YQYM5QDoN3aqHxFaRsoYDN1aovqsxcd7ftz6p4+zcDI7DNU45fHueGhKRd61paZ9aGBCP+JRoNGl7a7rEnFAgwird/QCVz1+/NsZiG6FkpIEwBIOkHJxKzePz9Em6QrlDDKLfQcYOR30QARxtFTaLzcnM9cd3bOwW20h3A7czQ+oF9o2hXr0HjmW9/0dOpF/oaHUeHInE+d9xWF/mkdes/RlJlt1JnjgW8uryXo3AyrLN/NV0v3Oc17zQo0C+jGpr6i0Zqn/1MXoPnzSaQoC9ci5eYWPELTY7TwDE3+2wEPM9SBuuM6Q7uSRYRFWMNr0BiY2/NK5W+PFrmgRVPUwixpUWRb4jk6TZhqDoGjgzrCWEJY+YwVyar2mX5tRCsM1SWOdvfvqd2Yrd0CmaXuXRuIdGoB+PfQHhZX04lWkkkVK25e3bZM37xcV8SKph7tZy8ja/BmON435GZml8lxhK4q2kTujOaUzvyWlxEPP53m0g2rWBO6KuhKVqgtYZnH1D8sXZI7d99hdZlSPZ16c7OiwxI55mr7uif1Mi5YDud7p4IwtY2NxBFdydKgjT4LhO+r5ZRydQuDIRWAmmAARzTE0XE3H01S92HLtOtwTd6nq08fHdmj/KD+164drbgOw0AYPvdm+EHv/7AHIgZhqN2YDZs1eNgshUL8oQzKTQuB6CSNmrSMtnnGjsg/oOWk+L66lXXCj+dC+2R5+lJvDtQ5LmehBSCIQTxc+HQP5UNmaAaKa6i4pIi0p4gO3YEkIYxGsnkU8urQUOjZsEV4x0vyJVKgitRA9Kf2aIx2qYmvgd4s0dTwsx2QHS8p/MENd2iMFfToPJVYQeN3OsKHz80+GYwGmqB59gJN0YCMrjfP8qQTUJM2fXhXbEby4k1uVnqCxiUz+p45ALrTC43UaBLN+UyAECBEKzSetZiaIQISXZZ5wA66XD41l+76V5Xj88wkqO2CizaQqIiJ1k00mRJHXm4qtQkTMiwZ2QjcIveMkbmEhV4YdIU831pMktSI6SDIVlf3STfMiunkyltE1z2KZnUdQMyChIxGSFOFIH6GHq3BWAiSzSR8pgDip+gn4naA1fM3co9Gi+h4JuRuFiT6lsHo+w6bH0NfbILMAppFdDwWAKTaDQto3YYsmFefHLGCXoGsmp+/odEi3kJ7wOtoVtDxdoyO7fJPL6C3mfRBP2w+aEboOOiHc9BP56CB7dAAbIYmsyWajdD8jvmg2Q3dmw/6oN82H3Tsg2ZL9NzMhmhgOzR/Cl2Yb4MWfwVdzCkasBoigrfRdk7M9R3Oi2icAg3L4eglNNhScb2HaBVaxBtoenN6Z+b6QY8EL6D/AxwOoM0aQTQTAAAAAElFTkSuQmCC';

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
                x: canvas_width - 20 - x,
                y: odd ? 0 : canvas_height - bubble_frame_height,
                speed: -2,
                frame: 0
            });
            odd = !odd;
        }

        this.bg_image = sky_image;
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
                    (diff_y >= 0 && diff_y <= 7 && diff_x >= 4 && diff_x <= 6) ||
                    (diff_y >= 8 && diff_y <= 11 && diff_x >= 2 && diff_x <= 4) ||
                    (diff_y >= 12 && diff_y <= 23 && diff_x >= 0 && diff_x <= 2) ||
                    (diff_y >= 24 && diff_y <= 27 && diff_x >= 2 && diff_x <= 4) ||
                    (diff_y >= 28 && diff_y <= 31 && diff_x >= 4 && diff_x <= 6) ||
                    (diff_y >= 32 && diff_y <= 42 && diff_x >= 6 && diff_x <= 8))
                {
                    play(air_hit_sound);
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
            butterfly.x -= 1;
            butterfly.y -= 1;
            butterfly.frame = (butterfly.frame + 1) % 8;
            return butterfly.y > -butterfly_frame_height;
        });
        if (this.bubbles.length == 0 && this.butterflies.length == 0) {
            onlevelend(true);
        }
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
}


class Violet1 extends VioletLevelBase {
    constructor(onlevelend) {
        super(onlevelend, 45);
    }
}



class Violet2 extends VioletLevelBase {
    constructor(onlevelend) {
        super(onlevelend, 55);
        this.minions = [];
        setTimeout(_ => this.release_minion(true), 1500);
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
status_font_image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAAAICAYAAADEI3zOAAABHUlEQVR42u1WyRHCMAzcZdx/JTRDCVQiHsCMEbZ1xXlFrzi6b/H5uAsAAhC8of/uQf//vvl5e3hWeC2HHZ0sbMBCxwhP452RO6O36Cx/ov5G4+iJ/5+uGy64IAitqyaqbxlU6ahqZ5U+4oHCibPCPR2LiS9w+GH55elwFLo4+8YgZzvgJz7NwRA1JJJ8JB2VIr0UZR6dHCnYz7NtaMFqk+DN4qlevWdH94YEbDojgLv0R25AbNJr3nPNMESPbhoThY6JIxOeEX/4SEusTMkE7uCJQ6NwrRh7VyUXU1br4OSMQFPJrI5iqYy9wCST4nv3+ti53uTAHEhmJd4Glc5Cd6zwNGgYlA/VERm8ZwUiERuvDBZXEB2yudgSmTziBSITjmXab+DjAAAAAElFTkSuQmCC';
let layout = {' ': {advance: 2, rect: [0, 8, 0, 0], offset: [0, 0]}, '!': {advance: 2, rect: [0, 0, 1, 8], offset: [0, 8]}, '0': {advance: 5, rect: [1, 0, 4, 8], offset: [0, 8]}, '1': {advance: 3, rect: [5, 0, 2, 8], offset: [0, 8]}, '2': {advance: 5, rect: [7, 0, 4, 8], offset: [0, 8]}, '3': {advance: 5, rect: [11, 0, 4, 8], offset: [0, 8]}, '4': {advance: 5, rect: [15, 0, 4, 8], offset: [0, 8]}, '5': {advance: 5, rect: [19, 0, 4, 8], offset: [0, 8]}, '6': {advance: 5, rect: [23, 0, 4, 8], offset: [0, 8]}, '7': {advance: 5, rect: [27, 0, 4, 8], offset: [0, 8]}, '8': {advance: 5, rect: [31, 0, 4, 8], offset: [0, 8]}, '9': {advance: 5, rect: [35, 0, 4, 8], offset: [0, 8]}, ':': {advance: 2, rect: [39, 2, 1, 4], offset: [0, 6]}, A: {advance: 5, rect: [40, 0, 4, 8], offset: [0, 8]}, B: {advance: 5, rect: [44, 0, 4, 8], offset: [0, 8]}, C: {advance: 5, rect: [48, 0, 4, 8], offset: [0, 8]}, D: {advance: 5, rect: [52, 0, 4, 8], offset: [0, 8]}, E: {advance: 5, rect: [56, 0, 4, 8], offset: [0, 8]}, F: {advance: 5, rect: [60, 0, 4, 8], offset: [0, 8]}, G: {advance: 5, rect: [64, 0, 4, 8], offset: [0, 8]}, H: {advance: 5, rect: [68, 0, 4, 8], offset: [0, 8]}, I: {advance: 2, rect: [72, 0, 1, 8], offset: [0, 8]}, J: {advance: 4, rect: [73, 0, 3, 8], offset: [0, 8]}, K: {advance: 5, rect: [76, 0, 4, 8], offset: [0, 8]}, L: {advance: 4, rect: [80, 0, 3, 8], offset: [0, 8]}, M: {advance: 6, rect: [83, 0, 5, 8], offset: [0, 8]}, N: {advance: 5, rect: [88, 0, 4, 8], offset: [0, 8]}, O: {advance: 5, rect: [92, 0, 4, 8], offset: [0, 8]}, P: {advance: 5, rect: [96, 0, 4, 8], offset: [0, 8]}, Q: {advance: 5, rect: [100, 0, 4, 8], offset: [0, 8]}, R: {advance: 5, rect: [104, 0, 4, 8], offset: [0, 8]}, S: {advance: 5, rect: [108, 0, 4, 8], offset: [0, 8]}, T: {advance: 4, rect: [112, 0, 3, 8], offset: [0, 8]}, U: {advance: 5, rect: [115, 0, 4, 8], offset: [0, 8]}, V: {advance: 6, rect: [119, 0, 5, 8], offset: [0, 8]}, W: {advance: 6, rect: [124, 0, 5, 8], offset: [0, 8]}, X: {advance: 5, rect: [129, 0, 4, 8], offset: [0, 8]}, Y: {advance: 5, rect: [133, 0, 4, 8], offset: [0, 8]}, Z: {advance: 5, rect: [137, 0, 4, 8], offset: [0, 8]}};
let status_font = new TextDrawer(status_font_image, layout, 20);

let shoot_sound = 'data:audio/ogg;base64,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',
    burst_sound = 'data:audio/ogg;base64,T2dnUwACAAAAAAAAAAAvOjQDAAAAANMfMEoBHgF2b3JiaXMAAAAAASgjAAAAAAAAIE4AAAAAAACZAU9nZ1MAAAAAAAAAAAAALzo0AwEAAAAWKsQ8C0X///////////+1A3ZvcmJpczUAAABYaXBoLk9yZyBsaWJWb3JiaXMgSSAyMDE4MDMxNiAoTm93IDEwMCUgZmV3ZXIgc2hlbGxzKQAAAAABBXZvcmJpcxJCQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBADIAAAYhiGH3knMkFOQSSYpVcw5CKH1DjnlFGTSUsaYYoxRzpBTDDEFMYbQKYUQ1E45pQwiCENInWTOIEs96OBi5zgQGrIiAIgCAACMQYwhxpBzDEoGIXKOScggRM45KZ2UTEoorbSWSQktldYi55yUTkompbQWUsuklNZCKwUAAAQ4AAAEWAiFhqwIAKIAABCDkFJIKcSUYk4xh5RSjinHkFLMOcWYcowx6CBUzDHIHIRIKcUYc0455iBkDCrmHIQMMgEAAAEOAAABFkKhISsCgDgBAIMkaZqlaaJoaZooeqaoqqIoqqrleabpmaaqeqKpqqaquq6pqq5seZ5peqaoqp4pqqqpqq5rqqrriqpqy6ar2rbpqrbsyrJuu7Ks256qyrapurJuqq5tu7Js664s27rkearqmabreqbpuqrr2rLqurLtmabriqor26bryrLryratyrKua6bpuqKr2q6purLtyq5tu7Ks+6br6rbqyrquyrLu27au+7KtC7vourauyq6uq7Ks67It67Zs20LJ81TVM03X9UzTdVXXtW3VdW1bM03XNV1XlkXVdWXVlXVddWVb90zTdU1XlWXTVWVZlWXddmVXl0XXtW1Vln1ddWVfl23d92VZ133TdXVblWXbV2VZ92Vd94VZt33dU1VbN11X103X1X1b131htm3fF11X11XZ1oVVlnXf1n1lmHWdMLqurqu27OuqLOu+ruvGMOu6MKy6bfyurQvDq+vGseu+rty+j2rbvvDqtjG8um4cu7Abv+37xrGpqm2brqvrpivrumzrvm/runGMrqvrqiz7uurKvm/ruvDrvi8Mo+vquirLurDasq/Lui4Mu64bw2rbwu7aunDMsi4Mt+8rx68LQ9W2heHVdaOr28ZvC8PSN3a+AACAAQcAgAATykChISsCgDgBAAYhCBVjECrGIIQQUgohpFQxBiFjDkrGHJQQSkkhlNIqxiBkjknIHJMQSmiplNBKKKWlUEpLoZTWUmotptRaDKG0FEpprZTSWmopttRSbBVjEDLnpGSOSSiltFZKaSlzTErGoKQOQiqlpNJKSa1lzknJoKPSOUippNJSSam1UEproZTWSkqxpdJKba3FGkppLaTSWkmptdRSba21WiPGIGSMQcmck1JKSamU0lrmnJQOOiqZg5JKKamVklKsmJPSQSglg4xKSaW1kkoroZTWSkqxhVJaa63VmFJLNZSSWkmpxVBKa621GlMrNYVQUgultBZKaa21VmtqLbZQQmuhpBZLKjG1FmNtrcUYSmmtpBJbKanFFluNrbVYU0s1lpJibK3V2EotOdZaa0ot1tJSjK21mFtMucVYaw0ltBZKaa2U0lpKrcXWWq2hlNZKKrGVklpsrdXYWow1lNJiKSm1kEpsrbVYW2w1ppZibLHVWFKLMcZYc0u11ZRai621WEsrNcYYa2415VIAAMCAAwBAgAlloNCQlQBAFAAAYAxjjEFoFHLMOSmNUs45JyVzDkIIKWXOQQghpc45CKW01DkHoZSUQikppRRbKCWl1losAACgwAEAIMAGTYnFAQoNWQkARAEAIMYoxRiExiClGIPQGKMUYxAqpRhzDkKlFGPOQcgYc85BKRljzkEnJYQQQimlhBBCKKWUAgAAChwAAAJs0JRYHKDQkBUBQBQAAGAMYgwxhiB0UjopEYRMSielkRJaCylllkqKJcbMWomtxNhICa2F1jJrJcbSYkatxFhiKgAA7MABAOzAQig0ZCUAkAcAQBijFGPOOWcQYsw5CCE0CDHmHIQQKsaccw5CCBVjzjkHIYTOOecghBBC55xzEEIIoYMQQgillNJBCCGEUkrpIIQQQimldBBCCKGUUgoAACpwAAAIsFFkc4KRoEJDVgIAeQAAgDFKOSclpUYpxiCkFFujFGMQUmqtYgxCSq3FWDEGIaXWYuwgpNRajLV2EFJqLcZaQ0qtxVhrziGl1mKsNdfUWoy15tx7ai3GWnPOuQAA3AUHALADG0U2JxgJKjRkJQCQBwBAIKQUY4w5h5RijDHnnENKMcaYc84pxhhzzjnnFGOMOeecc4wx55xzzjnGmHPOOeecc84556CDkDnnnHPQQeicc845CCF0zjnnHIQQCgAAKnAAAAiwUWRzgpGgQkNWAgDhAACAMZRSSimllFJKqKOUUkoppZRSAiGllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimVUkoppZRSSimllFJKKaUAIN8KBwD/BxtnWEk6KxwNLjRkJQAQDgAAGMMYhIw5JyWlhjEIpXROSkklNYxBKKVzElJKKYPQWmqlpNJSShmElGILIZWUWgqltFZrKam1lFIoKcUaS0qppdYy5ySkklpLrbaYOQelpNZaaq3FEEJKsbXWUmuxdVJSSa211lptLaSUWmstxtZibCWlllprqcXWWkyptRZbSy3G1mJLrcXYYosxxhoLAOBucACASLBxhpWks8LR4EJDVgIAIQEABDJKOeecgxBCCCFSijHnoIMQQgghREox5pyDEEIIIYSMMecghBBCCKGUkDHmHIQQQgghhFI65yCEUEoJpZRSSucchBBCCKWUUkoJIYQQQiillFJKKSGEEEoppZRSSiklhBBCKKWUUkoppYQQQiillFJKKaWUEEIopZRSSimllBJCCKGUUkoppZRSQgillFJKKaWUUkooIYRSSimllFJKCSWUUkoppZRSSikhlFJKKaWUUkoppQAAgAMHAIAAI+gko8oibDThwgMQAAAAAgACTACBAYKCUQgChBEIAAAAAAAIAPgAAEgKgIiIaOYMDhASFBYYGhweICIkAAAAAAAAAAAAAAAABE9nZ1MABI0KAAAAAAAALzo0AwIAAABOuAKdDElQTElHRUVFRUJCP65pcJYAFEWW/7WG5bI5koaHpnUqRx6fhe4P8RX3uy3WEzjaxgZw5oLA3zZcISIRczlkFEAo1F6Hgcgav7Z0ziAwgKXU3HWSEAC2LLkoANRqefqu5vWJ2RZNnXp+10t7bzAeDC+pOIca7bIfTvlkkrA6TEiz1QWkmKiEWyXN1wz3Tw4h9mATViE9dF1MwOl9FdkPaXZdC/fvAbIrZVEAKBbZzFCr4Wmag/epdbIXZCXnn+E8wsrQB2n7yK5dzqopipF+mb5hV1+Vn/Vom+z2ZccgdLqXK3lDXsvPaGamuqVZdh8oDACyZlCsBkBhIB+Pssr9k8npzTjZx1BdBhCGu1IBScvOpJ8n8hyfRXBRAuY0k2zSvcqb3SmLrKWwnWCoqIGdxEGXWGJzaU9rPUUeqqWryS4AWFBoaXdJkS3jUXLHaNyWVsRXmrubOXmEZAxQXSBcr0MH+pAtaN5V0oTxLZgKKRFMy/f+XszS4Q2njtS9KW+wjQKioRfVGkChSnfUouHZ2G37XA59bbRsDGQDoQ+37TlBSopo6W54UMOEGr7PJMnZkpKy69J2zvo+swNVp00a4yfL/cTlAACenfevSICcgfrySYDklVFrKfeNnhj2ozJJD/OVVNsRpxW2ktEGXXob7fU2696VK2NZ3JpSLZr2tIl2KQ0Mt8ssOLHpAQCeWnlvmZUAAFZUafmlQyLPzLUyvamIKHonIzIIHCeDZd2eO6/G4+xLGY3k6P5cWNDbx9OmV04rQzWwj/j2o7roD0efFwCeWERdqQQAKAT5lksVTigXS9HxXK+odh5b8LRwsiuvqOOaLURmHfDAOE+jfYrvarXskeHRxjzrhLJiE0uDLPFQbGXnIQWWVkVDZmMAAJVB+rUlIWQ4Ru1TUzHaAokPjDhwmHCpn3jXxmzDhswi7gPoYptmnVuBCbW3MgVwmTQuklQr9Ddz3wKOUsW3ogpgYeB/YgffyetmMmV1MjTJIr/V4RTwNOaR+ezqs2FLEMhKYswMTnkoL2hdLdZPEQ+eXWq8VOy1vcX+QwGGTcOdfBmDFKTOTd8vZDj4WcDE70kokkmKDnSQSUmWbCYediCPx2M2Au6PNV6egQqTcXBKNjOTAk7mxXL78gA=',
    win_sound = 'data:audio/ogg;base64,T2dnUwACAAAAAAAAAADEKwJLAAAAAPgqdDcBHgF2b3JiaXMAAAAAAbgLAAAAAAAA/////wAAAACZAU9nZ1MAAAAAAAAAAAAAxCsCSwEAAADO7/ZMC0X///////////+1A3ZvcmJpczUAAABYaXBoLk9yZyBsaWJWb3JiaXMgSSAyMDE4MDMxNiAoTm93IDEwMCUgZmV3ZXIgc2hlbGxzKQAAAAABBXZvcmJpcxJCQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBADIAAAYhiGH3knMkFOQSSYpVcw5CKH1DjnlFGTSUsaYYoxRzpBTDDEFMYbQKYUQ1E45pQwiCENInWTOIEs96OBi5zgQGrIiAIgCAACMQYwhxpBzDEoGIXKOScggRM45KZ2UTEoorbSWSQktldYi55yUTkompbQWUsuklNZCKwUAAAQ4AAAEWAiFhqwIAKIAABCDkFJIKcSUYk4xh5RSjinHkFLMOcWYcowx6CBUzDHIHIRIKcUYc0455iBkDCrmHIQMMgEAAAEOAAABFkKhISsCgDgBAIMkaZqlaaJoaZooeqaoqqIoqqrleabpmaaqeqKpqqaquq6pqq5seZ5peqaoqp4pqqqpqq5rqqrriqpqy6ar2rbpqrbsyrJuu7Ks256qyrapurJuqq5tu7Js664s27rkearqmabreqbpuqrr2rLqurLtmabriqor26bryrLryratyrKua6bpuqKr2q6purLtyq5tu7Ks+6br6rbqyrquyrLu27au+7KtC7vourauyq6uq7Ks67It67Zs20LJ81TVM03X9UzTdVXXtW3VdW1bM03XNV1XlkXVdWXVlXVddWVb90zTdU1XlWXTVWVZlWXddmVXl0XXtW1Vln1ddWVfl23d92VZ133TdXVblWXbV2VZ92Vd94VZt33dU1VbN11X103X1X1b131htm3fF11X11XZ1oVVlnXf1n1lmHWdMLqurqu27OuqLOu+ruvGMOu6MKy6bfyurQvDq+vGseu+rty+j2rbvvDqtjG8um4cu7Abv+37xrGpqm2brqvrpivrumzrvm/runGMrqvrqiz7uurKvm/ruvDrvi8Mo+vquirLurDasq/Lui4Mu64bw2rbwu7aunDMsi4Mt+8rx68LQ9W2heHVdaOr28ZvC8PSN3a+AACAAQcAgAATykChISsCgDgBAAYhCBVjECrGIIQQUgohpFQxBiFjDkrGHJQQSkkhlNIqxiBkjknIHJMQSmiplNBKKKWlUEpLoZTWUmotptRaDKG0FEpprZTSWmopttRSbBVjEDLnpGSOSSiltFZKaSlzTErGoKQOQiqlpNJKSa1lzknJoKPSOUippNJSSam1UEproZTWSkqxpdJKba3FGkppLaTSWkmptdRSba21WiPGIGSMQcmck1JKSamU0lrmnJQOOiqZg5JKKamVklKsmJPSQSglg4xKSaW1kkoroZTWSkqxhVJaa63VmFJLNZSSWkmpxVBKa621GlMrNYVQUgultBZKaa21VmtqLbZQQmuhpBZLKjG1FmNtrcUYSmmtpBJbKanFFluNrbVYU0s1lpJibK3V2EotOdZaa0ot1tJSjK21mFtMucVYaw0ltBZKaa2U0lpKrcXWWq2hlNZKKrGVklpsrdXYWow1lNJiKSm1kEpsrbVYW2w1ppZibLHVWFKLMcZYc0u11ZRai621WEsrNcYYa2415VIAAMCAAwBAgAlloNCQlQBAFAAAYAxjjEFoFHLMOSmNUs45JyVzDkIIKWXOQQghpc45CKW01DkHoZSUQikppRRbKCWl1losAACgwAEAIMAGTYnFAQoNWQkARAEAIMYoxRiExiClGIPQGKMUYxAqpRhzDkKlFGPOQcgYc85BKRljzkEnJYQQQimlhBBCKKWUAgAAChwAAAJs0JRYHKDQkBUBQBQAAGAMYgwxhiB0UjopEYRMSielkRJaCylllkqKJcbMWomtxNhICa2F1jJrJcbSYkatxFhiKgAA7MABAOzAQig0ZCUAkAcAQBijFGPOOWcQYsw5CCE0CDHmHIQQKsaccw5CCBVjzjkHIYTOOecghBBC55xzEEIIoYMQQgillNJBCCGEUkrpIIQQQimldBBCCKGUUgoAACpwAAAIsFFkc4KRoEJDVgIAeQAAgDFKOSclpUYpxiCkFFujFGMQUmqtYgxCSq3FWDEGIaXWYuwgpNRajLV2EFJqLcZaQ0qtxVhrziGl1mKsNdfUWoy15tx7ai3GWnPOuQAA3AUHALADG0U2JxgJKjRkJQCQBwBAIKQUY4w5h5RijDHnnENKMcaYc84pxhhzzjnnFGOMOeecc4wx55xzzjnGmHPOOeecc84556CDkDnnnHPQQeicc845CCF0zjnnHIQQCgAAKnAAAAiwUWRzgpGgQkNWAgDhAACAMZRSSimllFJKqKOUUkoppZRSAiGllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimVUkoppZRSSimllFJKKaUAIN8KBwD/BxtnWEk6KxwNLjRkJQAQDgAAGMMYhIw5JyWlhjEIpXROSkklNYxBKKVzElJKKYPQWmqlpNJSShmElGILIZWUWgqltFZrKam1lFIoKcUaS0qppdYy5ySkklpLrbaYOQelpNZaaq3FEEJKsbXWUmuxdVJSSa211lptLaSUWmstxtZibCWlllprqcXWWkyptRZbSy3G1mJLrcXYYosxxhoLAOBucACASLBxhpWks8LR4EJDVgIAIQEABDJKOeecgxBCCCFSijHnoIMQQgghREox5pyDEEIIIYSMMecghBBCCKGUkDHmHIQQQgghhFI65yCEUEoJpZRSSucchBBCCKWUUkoJIYQQQiillFJKKSGEEEoppZRSSiklhBBCKKWUUkoppYQQQiillFJKKaWUEEIopZRSSimllBJCCKGUUkoppZRSQgillFJKKaWUUkooIYRSSimllFJKCSWUUkoppZRSSikhlFJKKaWUUkoppQAAgAMHAIAAI+gko8oibDThwgMQAAAAAgACTACBAYKCUQgChBEIAAAAAAAIAPgAAEgKgIiIaOYMDhASFBYYGhweICIkAAAAAAAAAAAAAAAABE9nZ1MABIcFAAAAAAAAxCsCSwIAAAD7zdFTBzpHRkRCPTSuLPvLFCwJMsCSAoUH6FZdMR9a+72mK69QNFFR0YSuie5aUyKgE3e/vpIUFwCQu7vDE1zXx54JIO1Bti/7TiRCbgmgAB9EE4W4d+V4YtEIpo1lLAAAXc7Dg3nSM7hce+9GjRYSMrSyI3UXssuNy9qK7m5b/K3CS0dwJALovnYjHgDGNHuXSISIEh2LgZmwABQAE+cRpU05Hgpdf3dVAQAAPrebFdSJ6MD9LZOGuoIAOlrM416AAv357IavLRxAQ1MA0K/9NXcAujL7XiUIroSEBtCNovU72nedyJ08bGnFtuX/JFkFwecVAJK7C74GhqrWHBWfz0C943mljGaJjH3L7C3tAOjj9WDlMQCyMWsmNhOuE9AA2vqTosNDZhZ/TNOX5VfP3W721txp1QDRfioAgIJAX11/2Ji9vyFThMnPPQLjgDW+jQAAsC9ntwGWK6d+G6yT07XlcTypWTx+fOWhpI/Zh5morr+edrqZmOe5s6tXR4AeV+9XYed4V5wDwMLtPpoBAH39/WoCmpC2TUEUACIXAMrbxt2zbZ+7G2A5rtopzge3SxloluPaevJ1GoB8uEw+dALM5w5wsdsLAQ==',
    lose_sound = 'data:audio/ogg;base64,T2dnUwACAAAAAAAAAACvA9p5AAAAADWnjFABHgF2b3JiaXMAAAAAAbgLAAAAAAAA/////wAAAACZAU9nZ1MAAAAAAAAAAAAArwPaeQEAAAC7Dz+fC0X///////////+1A3ZvcmJpczUAAABYaXBoLk9yZyBsaWJWb3JiaXMgSSAyMDE4MDMxNiAoTm93IDEwMCUgZmV3ZXIgc2hlbGxzKQAAAAABBXZvcmJpcxJCQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBADIAAAYhiGH3knMkFOQSSYpVcw5CKH1DjnlFGTSUsaYYoxRzpBTDDEFMYbQKYUQ1E45pQwiCENInWTOIEs96OBi5zgQGrIiAIgCAACMQYwhxpBzDEoGIXKOScggRM45KZ2UTEoorbSWSQktldYi55yUTkompbQWUsuklNZCKwUAAAQ4AAAEWAiFhqwIAKIAABCDkFJIKcSUYk4xh5RSjinHkFLMOcWYcowx6CBUzDHIHIRIKcUYc0455iBkDCrmHIQMMgEAAAEOAAABFkKhISsCgDgBAIMkaZqlaaJoaZooeqaoqqIoqqrleabpmaaqeqKpqqaquq6pqq5seZ5peqaoqp4pqqqpqq5rqqrriqpqy6ar2rbpqrbsyrJuu7Ks256qyrapurJuqq5tu7Js664s27rkearqmabreqbpuqrr2rLqurLtmabriqor26bryrLryratyrKua6bpuqKr2q6purLtyq5tu7Ks+6br6rbqyrquyrLu27au+7KtC7vourauyq6uq7Ks67It67Zs20LJ81TVM03X9UzTdVXXtW3VdW1bM03XNV1XlkXVdWXVlXVddWVb90zTdU1XlWXTVWVZlWXddmVXl0XXtW1Vln1ddWVfl23d92VZ133TdXVblWXbV2VZ92Vd94VZt33dU1VbN11X103X1X1b131htm3fF11X11XZ1oVVlnXf1n1lmHWdMLqurqu27OuqLOu+ruvGMOu6MKy6bfyurQvDq+vGseu+rty+j2rbvvDqtjG8um4cu7Abv+37xrGpqm2brqvrpivrumzrvm/runGMrqvrqiz7uurKvm/ruvDrvi8Mo+vquirLurDasq/Lui4Mu64bw2rbwu7aunDMsi4Mt+8rx68LQ9W2heHVdaOr28ZvC8PSN3a+AACAAQcAgAATykChISsCgDgBAAYhCBVjECrGIIQQUgohpFQxBiFjDkrGHJQQSkkhlNIqxiBkjknIHJMQSmiplNBKKKWlUEpLoZTWUmotptRaDKG0FEpprZTSWmopttRSbBVjEDLnpGSOSSiltFZKaSlzTErGoKQOQiqlpNJKSa1lzknJoKPSOUippNJSSam1UEproZTWSkqxpdJKba3FGkppLaTSWkmptdRSba21WiPGIGSMQcmck1JKSamU0lrmnJQOOiqZg5JKKamVklKsmJPSQSglg4xKSaW1kkoroZTWSkqxhVJaa63VmFJLNZSSWkmpxVBKa621GlMrNYVQUgultBZKaa21VmtqLbZQQmuhpBZLKjG1FmNtrcUYSmmtpBJbKanFFluNrbVYU0s1lpJibK3V2EotOdZaa0ot1tJSjK21mFtMucVYaw0ltBZKaa2U0lpKrcXWWq2hlNZKKrGVklpsrdXYWow1lNJiKSm1kEpsrbVYW2w1ppZibLHVWFKLMcZYc0u11ZRai621WEsrNcYYa2415VIAAMCAAwBAgAlloNCQlQBAFAAAYAxjjEFoFHLMOSmNUs45JyVzDkIIKWXOQQghpc45CKW01DkHoZSUQikppRRbKCWl1losAACgwAEAIMAGTYnFAQoNWQkARAEAIMYoxRiExiClGIPQGKMUYxAqpRhzDkKlFGPOQcgYc85BKRljzkEnJYQQQimlhBBCKKWUAgAAChwAAAJs0JRYHKDQkBUBQBQAAGAMYgwxhiB0UjopEYRMSielkRJaCylllkqKJcbMWomtxNhICa2F1jJrJcbSYkatxFhiKgAA7MABAOzAQig0ZCUAkAcAQBijFGPOOWcQYsw5CCE0CDHmHIQQKsaccw5CCBVjzjkHIYTOOecghBBC55xzEEIIoYMQQgillNJBCCGEUkrpIIQQQimldBBCCKGUUgoAACpwAAAIsFFkc4KRoEJDVgIAeQAAgDFKOSclpUYpxiCkFFujFGMQUmqtYgxCSq3FWDEGIaXWYuwgpNRajLV2EFJqLcZaQ0qtxVhrziGl1mKsNdfUWoy15tx7ai3GWnPOuQAA3AUHALADG0U2JxgJKjRkJQCQBwBAIKQUY4w5h5RijDHnnENKMcaYc84pxhhzzjnnFGOMOeecc4wx55xzzjnGmHPOOeecc84556CDkDnnnHPQQeicc845CCF0zjnnHIQQCgAAKnAAAAiwUWRzgpGgQkNWAgDhAACAMZRSSimllFJKqKOUUkoppZRSAiGllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimVUkoppZRSSimllFJKKaUAIN8KBwD/BxtnWEk6KxwNLjRkJQAQDgAAGMMYhIw5JyWlhjEIpXROSkklNYxBKKVzElJKKYPQWmqlpNJSShmElGILIZWUWgqltFZrKam1lFIoKcUaS0qppdYy5ySkklpLrbaYOQelpNZaaq3FEEJKsbXWUmuxdVJSSa211lptLaSUWmstxtZibCWlllprqcXWWkyptRZbSy3G1mJLrcXYYosxxhoLAOBucACASLBxhpWks8LR4EJDVgIAIQEABDJKOeecgxBCCCFSijHnoIMQQgghREox5pyDEEIIIYSMMecghBBCCKGUkDHmHIQQQgghhFI65yCEUEoJpZRSSucchBBCCKWUUkoJIYQQQiillFJKKSGEEEoppZRSSiklhBBCKKWUUkoppYQQQiillFJKKaWUEEIopZRSSimllBJCCKGUUkoppZRSQgillFJKKaWUUkooIYRSSimllFJKCSWUUkoppZRSSikhlFJKKaWUUkoppQAAgAMHAIAAI+gko8oibDThwgMQAAAAAgACTACBAYKCUQgChBEIAAAAAAAIAPgAAEgKgIiIaOYMDhASFBYYGhweICIkAAAAAAAAAAAAAAAABE9nZ1MABOMFAAAAAAAArwPaeQIAAABEOqKAB0Q6NTM9NzXKbnmqAE6FfUJLAWTVbS5U/MdmfaXsG221Z2PTR7qhqWBbCEelH5VPdoMAGEHt9X9sWTXCvFT9N3DajC+u2TSAKt6vCdavzWBoHCZoa8AYAHhnJ4Cb28GpzisA5HMATv8JAMYRBfgqleGIwJ4WB3xGwNGLK4udqpHI8iuYHgDSbv1cQ+eSguSwAYAfmwL4z14F/NJMBRhmAcSPAlwioItFiAuIibpXYRcqxAAisVdvB0ClBs4ue3wZINkOOG4A4HETgJMDBXz3vQIMGWAX9DfYBDLg9+tZv9vpUjO4GfKwix2ladDRANKrxoaDBtBjAHKQGCkA3J4G4NdxANvZ4QIoJAA4iQDszFKAXZBwq9lbyLOEYQ4/kmp4cTM8LQUjAe6obQDKafjrYBhgCwAcpwGo3dkCsL8dgFFfARBKALenSnirgn6YBgMUf8+pznPji2/Rn2ANHORbPlsDsqF/NQC2BjqnAag/1zqAf344Ccy/+LIDAIB+934VAOs5zZxWyvpQlo5LtwT9WVmTCnAJPwA=',
    air_hit_sound = 'data:audio/ogg;base64,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lAIAAAocAAACbNCUWByg0JAVAUAUAABgDGIMMYYgdFI6KRGETEonpZESWgspZZZKiiXGzFqJrcTYSAmthdYyayXG0mJGrcRYYioAAOzAAQDswEIoNGQlAJAHAEAYoxRjzjlnEGLMOQghNAgx5hyEECrGnHMOQggVY845ByGEzjnnIIQQQueccxBCCKGDEEIIpZTSQQghhFJK6SCEEEIppXQQQgihlFIKAAAqcAAACLBRZHOCkaBCQ1YCAHkAAIAxSjknJaVGKcYgpBRboxRjEFJqrWIMQkqtxVgxBiGl1mLsIKTUWoy1dhBSai3GWkNKrcVYa84hpdZirDXX1FqMtebce2otxlpzzrkAANwFBwCwAxtFNicYCSo0ZCUAkAcAQCCkFGOMOYeUYowx55xDSjHGmHPOKcYYc8455xRjjDnnnHOMMeecc845xphzzjnnnHPOOeegg5A555xz0EHonHPOOQghdM455xyEEAoAACpwAAAIsFFkc4KRoEJDVgIA4QAAgDGUUkoppZRSSqijlFJKKaWUUgIhpZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoplVJKKaWUUkoppZRSSimlACDfCgcA/wcbZ1hJOiscDS40ZCUAEA4AABjDGISMOSclpYYxCKV0TkpJJTWMQSilcxJSSimD0FpqpaTSUkoZhJRiCyGVlFoKpbRWaymptZRSKCnFGktKqaXWMuckpJJaS622mDkHpaTWWmqtxRBCSrG11lJrsXVSUkmttdZabS2klFprLcbWYmwlpZZaa6nF1lpMqbUWW0stxtZiS63F2GKLMcYaCwDgbnAAgEiwcYaVpLPC0eBCQ1YCACEBAAQySjnnnIMQQgghUoox56CDEEIIIURKMeacgxBCCCGEjDHnIIQQQgihlJAx5hyEEEIIIYRSOucghFBKCaWUUkrnHIQQQgillFJKCSGEEEIopZRSSikhhBBKKaWUUkopJYQQQiillFJKKaWEEEIopZRSSimllBBCKKWUUkoppZQSQgihlFJKKaWUUkIIpZRSSimllFJKKCGEUkoppZRSSgkllFJKKaWUUkopIZRSSimllFJKKaUAAIADBwCAACPoJKPKImw04cIDEAAAAAIAAkwAgQGCglEIAoQRCAAAAAAACAD4AABICoCIiGjmDA4QEhQWGBocHiAiJAAAAAAAAAAAAAAAAARPZ2dTAAQ5BwAAAAAAAD/PeQgCAAAAfW5EJgk8Pzw/Pzw9OQ6uJGNoge0TMgVnLbh3Y3lES2t9mImxXLMpg3HRHeCzv9jxuPoUv3epHT3o4bO/GH28M4eFrIL0VoH9UwLGJuNIZoAiAQoVt1JA/3ty34ksDeuwjNxV0o/SDE/1Ygj4lGw3vlB6kCQyzknBEBt2SstMB3VxzxZ4Ia29SgPOpPTt+DIZnhxQN3fmFBKUBzYJhowYHUPq8/4mTuqsRRy7+klWAjsa6aq8ctFIcPDizkIcFsrAt/c3qgCqoGpTCkyQyWlDysuf/rlscSDHY5KOd6YGGVK5csTP/3Hq7F7oijgnSmZ62D2zeGU8TWf/Dw/gOTebkIzyGgCan+ZRi+ADcio21Vmd9x7bbkiBLHaG+BaGwzyrstSKQFeER19ufR3erPe7Mk6lQTNTWSP2zhgt+hcZ48siBgCenMpUnyrQHhTr0fRrLAcoVxCRTpE9JOm0GF0rF9Gw1DvoiqZnvbr2D3XrFqFXVcun7goxRyVAW9y2PgGWmuq9jQOZDL8iSs48X3eE2CMX0fKY/pqzdw+JgeMao2RTKBEP/KkTgIRoolQNpJ6tJKuQUVuk5bzd3RgAilZlWAWAjEqPAQbz/KOpVM4if0DmEiRV4zhS/EnJWyQMTBbal4Lw6vvqW3fmXLh8L1LBFIRwyTIAigv3Od54AAAA4NM1AQA=';

function play(sound, mute_background) {
    new Audio(sound).play();
}


let bow = new Bow(80, 3),
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
        play(win_sound);
        ++level_n;
        if (level_n > levels_count) {
            level_n = 1;
        }
    } else {
        if (success === false) {
            play(lose_sound);
        }
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
    level.draw_on(ctx);
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
        arrow.x += arrow.speed;
        return arrow.x < canvas_width && arrow.x > -arrow_width;
    });
    setTimeout(update, 20);
}

onlevelend(); // argument undefined on purpose
update();
draw();

