const rpn = require('./rpn');

exports.addition = function (test) {
    test.expect(1);
    test.equals(rpn.compute(prep('1 2 +')), 3);
    test.done();
};

exports.subtraction = function (test) {
    test.expect(1);
    test.equals(rpn.compute(prep('7 2 -')), 5);
    test.done();
};

exports.multiplication = function (test) {
    test.expect(1);
    test.equals(rpn.compute(prep('5 4 *')), 20);
    test.done();
};

exports.division = function (test) {
    test.expect(1);
    test.equals(rpn.compute(prep('39 13 /')), 3);
    test.done();
};

function prep(str) {
    return str.trim().split(/[ ]+/);
}
