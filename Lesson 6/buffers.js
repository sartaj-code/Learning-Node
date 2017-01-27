
const b = new Buffer(100000);
const str = 'hello world';

b.write(str);

console.log(str.length);
console.log(b.length);

