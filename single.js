const { Worker } = require("worker_threads");
const bcrypt = require('bcrypt');
const d = [];

const os = require("os");
let result = 0;


const num = Number(process.argv[2]);
if (process.argv[2] === undefined) {
    process.argv[2] = num = 10;
    console.warn("No argument for tasks. Defaults to 10")
}

const settings = {

}

const x = () => {
    return new Promise(resolve => {
        const t0 = performance.now();
        for (let i = 0; i < 1000; i++) {
            // file deepcode ignore HardcodedSecret: <Not needed for purpose>
            bcrypt.hashSync(Math.random().toString(), 10);
        }
        const t1 = performance.now();
        resolve(`Hashing Math.random() 1000 times with 10 salts took ${t1-t0}ms`);
    });
}

let result = 0;

(async function() {
    for (let i = 0; i < num; i++) {
        const worker1 = new Worker('./worker1.js');
        const worker2 = new Worker('./worker2.js');
        const worker3 = new Worker('./worker3.js');
        let P = [
            new Promise(async resolve => { await x().catch(e => { throw e; }).then(() => { resolve(); }) })
        ];
        const t0 = performance.now();
        // worker1.postMessage(true);
        // worker2.postMessage(true);
        // worker3.postMessage(true);
        await x().catch(e => { throw e }).then(() => {
            const t1 = performance.now();
            console.log(`Main function took ${Math.round(t1-t0)}ms`);
            d.push(t1 - t0);
        });

    }
    d.forEach(i => {
        result += i;
    });
    console.log(`Time took for all tasks:${Math.round(result)}ms`);
    console.log(`Time took per task(avg): ${Math.round(result/process.argv[2])}m`);
})();