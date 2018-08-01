// include_once{balloon_level_base.js}

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
