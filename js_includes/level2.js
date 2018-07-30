// include_once{balloon_level_base.js}

class Level2 extends BalloonLevelBase {
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
