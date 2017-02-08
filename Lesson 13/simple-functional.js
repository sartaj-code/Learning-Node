exports.test_the_first = function (test) {
    test.equals(true, true);
    test.ok(true);
    test.done();
};

exports.test_the_second = function (test) {
    test.strictEqual(5, 5);
    test.notStrictEqual('5', 5);
    test.done();
};

exports.group1 = {

    setUp: function (callback) {
        console.log('Setting up the tests');
        callback();
    },

    tearDown: function (callback) {
        console.log('Tearing down the tests');
        callback();
    },

    test1: function (test) {
        test.ok(true);
        test.done();
    },

    test2: function (test) {
        test.equals('a', 'a');
        test.done();
    }
};