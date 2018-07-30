// code that might be useful again some day

// find first not transparent pixel in each line and create collision condition

let canvas = document.createElement('canvas');
canvas.width = violet_width;
canvas.height = violet_height;
let ctx2d = canvas.getContext('2d');
ctx2d.drawImage(violet_image, violet_pos_x, violet_pos_y, violet_width, violet_height, 0, 0, violet_width, violet_height);
let first_not_transparents_in_row = [];
for (let y = 0; y < violet_height; ++y) {
    let found = false;
    for (let x = 0; x < violet_width; ++x) {
        let a = ctx2d.getImageData(x, y, 1, 1).data[3];
        if (a == 255) {
            first_not_transparents_in_row.push(x);
            found = true;
            break;
        }
    }
    if (!found) {
        throw 'Should not end up here';
    }
}
first_not_transparents_in_row.push(null); // terminator
console.log(first_not_transparents_in_row);
let cond = '',
    val_start_y = 0,
    current_val = first_not_transparents_in_row[0],
    y = 1;
for (; current_val != null; ++y) {
    if (first_not_transparents_in_row[y] != current_val) {
        cond += `(diff_y >= ${val_start_y} && diff_y <= ${y-1} && diff_x >= ${current_val} && diff_x <= ${current_val + 2}) ||\n`;
        val_start_y = y;
        current_val = first_not_transparents_in_row[y];
    }
}
console.log(cond);
