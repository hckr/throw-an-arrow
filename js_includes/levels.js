// include_once{level1.js}
// include_once{level2.js}
// include_once{level3.js}
// include_once{level4.js}

let levels_count = 4;

function construct_level(n, onlevelend) {
    switch (n) {
    case 1:
        return new Level1(onlevelend);
    case 2:
        return new Level2(onlevelend);
    case 3:
        return new Level3(onlevelend);
    case 4:
        return new Level4(onlevelend);
    }
}
