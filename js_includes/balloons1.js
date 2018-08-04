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
