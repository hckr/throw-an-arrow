let shoot_sound = '#datauri{audio/ogg,assets/sounds/shoot.ogg}',
    burst_sound = '#datauri{audio/ogg,assets/sounds/burst.ogg}';

function play(sound) {
    new Audio(sound).play();
}
