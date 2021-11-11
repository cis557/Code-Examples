// import events
const EventEmitter = require('events');

// instantiate a new emitter object
const myEmitter = new EventEmitter.EventEmitter();

// add listener to the event
myEmitter.on('myevent', () => {
  console.log('an event occurred! - listener1');
});


const aFun = () => {
  setImmediate(() => console.log('Asynchronous listener: an event occurred! - listener2'));  
};


// add asynchronous listener to the event
myEmitter.on('myevent', aFun);

function fun(x) {
  console.log(`${x} event occurred! - listener3`);
}
// add another listener to the event
myEmitter.on('myevent', fun);

// trigger the event with an argument
myEmitter.emit('myevent', 'Helloooooo!! ');

console.log('test');
