
// const greeter = require('./greeter');
//
// greeter.hello_world();
//
// const g = greeter.create_greeter('de');
//
// console.log(g.greet());

const Greeter = require('./greeter');

const g = new Greeter('fr');

console.log(g.greet());