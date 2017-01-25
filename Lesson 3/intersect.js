
const arrays = require('./arrays');

setTimeout(function () {
    console.log('YO YO YO!');
}, 3000);

//
// Computationally resource intensive method - prevents 'YO YO YO!' from being
// taken off the event queue after 3 seconds and executed.
//
// function intersect(arr1, arr2) {
//
//     let intersection = [];
//
//     for (let i = 0; i < arr1.length; i++) {
//         for (let j = 0; j < arr2.length; j++) {
//             if (arr2[j] === arr1[i]) {
//                 intersection.push(arr2[j]);
//                 break;
//             }
//         }
//     }
//
//     return intersection;
// }

//
// Rewritten
//
function intersect(arr1, arr2, callback) {

    let intersection = [];
    let i = 0;

    // for (let i = 0; i < arr1.length; i++) {
    //     for (let j = 0; j < arr2.length; j++) {
    //         if (arr2[j] === arr1[i]) {
    //             intersection.push(arr2[j]);
    //             break;
    //         }
    //     }
    // }

    sub_compute_intersection();

    function sub_compute_intersection() {
        for (let j = 0; j < arr2.length; j++) {
            if (arr2[j] === arr1[i]) {
                intersection.push(arr2[j]);
                break;
            }
        }

        if (i < arr1.length) {
            ++i;
            if (i % 1000 === 0) console.log(i);
            setImmediate(sub_compute_intersection);
        } else {
            callback(intersection)
        }

    }

    // return intersection;
}

// console.log(intersect(arrays.arr1, arrays.arr2).length);

//
// Possible solutions to resource hogging:
//
// process.nextTick(callback)
//
// setImmediate(callback)
//

intersect(arrays.arr1, arrays.arr2, function (results) {
    console.log(results.length);
});
