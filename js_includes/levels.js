// include_once{level1.js}
// include_once{level2.js}

let levels_count = 2;

function construct_level(n, onlevelend) {
    switch (n) {
    case 1:
        return new Level1(onlevelend);
    case 2:
        return new Level2(onlevelend);
    }
}
