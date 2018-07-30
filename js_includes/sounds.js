let shoot_sound = '#datauri{audio/ogg,assets/sounds/shoot.ogg}',
    burst_sound = '#datauri{audio/ogg,assets/sounds/burst.ogg}',
    win_sound = '#datauri{audio/ogg,assets/sounds/win.ogg}',
    lose_sound = '#datauri{audio/ogg,assets/sounds/lose.ogg}';

function play(sound, mute_background) {
    new Audio(sound).play();
}
