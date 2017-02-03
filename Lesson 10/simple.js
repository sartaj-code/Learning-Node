setInterval(function () {
    console.log('Request!');

    if (Math.random() < 0.33) {
        throw new Error('Booo!!!');
    }
}, 2000);