
try {
    setTimeout(() => {
        throw new Error('Oh, heck!!!!');
    }, 4000);
} catch (e) {
    console.log("I caught the error: " + e.message);
}
