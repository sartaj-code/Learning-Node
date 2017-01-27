
function Greeter(lang) {
    this.language = lang;
    
    this.greet = function () {
        switch (lang) {
            case 'en': return 'Hello!';
            case 'fr': return 'Bonjour!';
            case 'de': return 'Guten Tag!';
            default: return `Don't speaka that lingo`;
        }
    }
}

module.exports = Greeter;

// exports.hello_world = function () {
//     console.log('Hello World!');
// };
//
// exports.goodbye = function () {
//     console.log('Hello World!');
// };

// Factory model
// exports.create_greeter = function (lang) {
//     return new Greeter(lang);
// };
