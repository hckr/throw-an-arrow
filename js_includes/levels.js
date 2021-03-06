// include_once{balloons1.js}
// include_once{balloons2.js}
// include_once{bubbles1.js}
// include_once{violet1.js}
// include_once{violet2.js}

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
