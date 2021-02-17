/* eslint-disable no-console */

// (1 testing event phases)
const t0 = document.getElementById('div0');
const t1 = document.getElementById('div1');
const t2 = document.getElementById('div2');
const t3 = document.getElementById('div3');
// 2.1 t0  captures a click, stops the propagation

t0.addEventListener('click', (e) => {
  console.log(`t0, Target: ${e.target.id}, Phase: ${e.eventPhase}`);
  //e.stopPropagation();
}, true);
 
t1.addEventListener('click', (e) => console.log(`t1, Target: ${e.target.id}, Phase: ${e.eventPhase}`), true);
 
t2.addEventListener('click', (e) => console.log(`t2, Target: ${e.target.id}, Phase: ${e.eventPhase}`), true);

t3.addEventListener('click', (e) => console.log(`t3, Target: ${e.target.id}, Phase: ${e.eventPhase}`), true);


t0.addEventListener('click', (e) => console.log(`t0, Target: ${e.target.id}, Phase: ${e.eventPhase}`), false);
 
t1.addEventListener('click', (e) => console.log(`t1, Target: ${e.target.id}, Phase: ${e.eventPhase}`), false);
 
t2.addEventListener('click', (e) => {
  console.log(`t2, Target: ${e.target.id}, Phase: ${e.eventPhase}`);
  //e.stopPropagation();
}, false);
 
t3.addEventListener('click', (e) => console.log(`t3, Target: ${e.target.id}, Phase: ${e.eventPhase}`), false);

 
// 2 custom event
t1.addEventListener('copy', () => {
  const newE = new CustomEvent('hello', { detail: 'Yay! something eventful!!!!' });
  console.log(`new event ${JSON.stringify(newE.detail)}`);
  t1.dispatchEvent(newE);
}, false);

// add event listener to parent (div0) of the event firing element (btn)
t0.addEventListener('hello', (e) => {
  console.log(`${e.type}\n${e.timeStamp}\n${e.target.id}\n${e.eventPhase}`);
  t3.innerHTML = `${e.detail}`;
},
true);
