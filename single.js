const {Worker} = require("worker_threads");
const bcrypt = require('bcrypt');
const d = [];


// worker1.on('message', e => {
//     console.log(e);
// });
// worker2.on('message', e => {
//     console.log(e);
// });
// worker3.on('message', e => {
//     console.log(e);
// });

// worker1.on("exit", e => {
//     console.log("owo");
//     P1.resolve();
// });

// worker2.on("exit", e => {
//     P2.resolve();
// })


// worker3.on("exit", e => {
//     P3.resolve();
// })

// let P1 = new Promise(resolve => {worker1.on("exit", () => {resolve();})});
// let P2 = new Promise(resolve => {worker2.on("exit", () => {resolve();})});
// let P3 = new Promise(resolve => {worker3.on("exit", () => {resolve();})});
const x = () =>
{
    return new Promise(resolve => {
        const t0 = performance.now();
        for (let i = 0; i < 1000; i++) {
            // file deepcode ignore HardcodedSecret: <Not needed for purpose>
            bcrypt.hashSync(Math.random().toString(), 10);
        }
        const t1 = performance.now();
        resolve(`Hashing Math.random() 333 times with 10 salts took ${t1-t0}ms`);
    });
}

let result = 0;

(async function() {
        for(let i = 0; i < 10; i++)
        {
            const worker1 = new Worker('./worker1.js');
            const worker2 = new Worker('./worker2.js');
            const worker3 = new Worker('./worker3.js');
            let P = [
                new Promise(async resolve => {await x().catch(e => {throw e;}).then(() => {resolve();})})
            ];
            const t0 = performance.now();
            // worker1.postMessage(true);
            // worker2.postMessage(true);
            // worker3.postMessage(true);
            await x().catch(e => {throw e}).then(() => {
                const t1 = performance.now();
                console.log(`Main function took ${t1-t0}ms`);
                d.push(t1-t0);
            });
            
        }
        d.forEach(i => {
            result+=i;
        });
        console.log(result);
        console.log(result/10);
})();