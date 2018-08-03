// include_once{violet_level_base.js}

class Violet1 extends VioletLevelBase {
    constructor(onlevelend) {
        super(onlevelend, 45);

        this.title = 'Bad weather';
        this.description = `
Some angry clouds are on their way.
Don't let them ruin the weather.
You have to hit them multiple times
until they go away.`.trim();
    }
}
