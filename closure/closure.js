let gCount = 0; 
function makeCounter() {
    let count = 0; 
    function incrCount() {
        count = count + 1; 
        gCount  = gCount  + 1; 
        console.log(`${count} : ${gCount}` );
    }
    return incrCount;
}
const myCount = makeCounter(); 
const myCount1 = makeCounter(); 
myCount(); 
myCount(); 
myCount1();