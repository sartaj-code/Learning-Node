exports.test1 = function (test) {
    setTimeout(function () {
        test.ok(true);
        test.done();
    }, 2000);
};

exports.test2 = function (test) {
    setTimeout(function () {
        test.equals(10, 10);
        test.done();
    }, 1400);
};