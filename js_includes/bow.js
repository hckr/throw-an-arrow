// include_once{images.js}
// include_once{sounds.js}

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

Bow.prototype.draw_on = function(ctx) {
    ctx.drawImage(bow_image, (this.frame % 6) * bow_frame_width, ((this.frame / 6) | 0) * bow_frame_height, bow_frame_width, bow_frame_height,
                  0, this.pos_y, bow_frame_width, bow_frame_height);

    if (this.state == BowState.STRAINED) {
        console.log('test');
        ctx.drawImage(arrow_image, 0, this.pos_y + 20);
    }
}
