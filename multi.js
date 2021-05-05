const { Worker } = require("worker_threads");

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

let result = 0;


const num = Number(process.argv[2]);
if (process.argv[3] === undefined) {
    process.argv[3] = 10;
    console.warn("Keine 2. Zahl agegeben, nehme 10 Runden Standard")
}
(async function() {
    //console.log(num);
    for (let i = 0; i < process.argv[3]; i++) {
        const workers = [];
        switch (true) {
            case (num > 0):
            case (num < 16):
                for (let o = 0; o < num; o++) {
                    workers.push(new Worker(`./workers/worker${num}.js`));
                }
                break;
            default:
                throw ("Ungültige Nummer");
        }

        //const worker1 =  new Worker('./workers/worker1.js');
        // const worker2 =  new Worker('./workers/worker2.js');
        // const worker3 =  new Worker('./workers/worker3.js');
        // const worker4 =  new Worker('./workers/worker4.js');
        // const worker5 =  new Worker('./workers/worker5.js');
        // const worker6 =  new Worker('./workers/worker6.js');
        // const worker7 =  new Worker('./workers/worker7.js');
        // const worker8 =  new Worker('./workers/worker8.js');
        // const worker9 =  new Worker('./workers/worker9.js');
        // const worker10 = new Worker('./workers/worker10.js');
        // const worker11 = new Worker('./workers/worker11.js');
        // const worker12 = new Worker('./workers/worker12.js');
        // const worker13 = new Worker('./workers/worker13.js');
        // const worker14 = new Worker('./workers/worker14.js');
        // const worker15 = new Worker('./workers/worker15.js');
        // const worker16 = new Worker('./workers/worker16.js');
        //console.dir(workers[0]);
        let P = [
            //new Promise(resolve => {workers[].on("exit", () => {resolve();})})
        ];
        workers.forEach((w, i) => {
            P.push(new Promise(resolve => { w.on("exit", () => resolve()) }))
        })
        const t0 = performance.now();

        workers.forEach((w, i) => {
            w.postMessage([num, i + 1]); //w präsentiert das Objekt. console.log => w.log(i);
        });
        // worker1.postMessage(true);
        // worker2.postMessage(true);
        // worker3.postMessage(true);
        // worker4.postMessage(true);
        // worker5.postMessage(true);
        // worker6.postMessage(true);
        // worker7.postMessage(true);
        // worker8.postMessage(true);
        // worker9.postMessage(true);
        // worker10.postMessage(true);
        // worker11.postMessage(true);
        // worker12.postMessage(true);
        // worker13.postMessage(true);
        // worker14.postMessage(true);
        // worker15.postMessage(true);
        // worker16.postMessage(true);
        //console.dir(P);
        await Promise.all(P).then(() => {
            const t1 = performance.now();
            console.log(`Main function took ${Math.round(t1-t0)}ms`);
            d.push(t1 - t0);
        }).catch(e => { throw e; });

    }
    d.forEach(i => {
        result += i;
    });
    console.log(`Time took for all tasks: ${Math.round(result)}ms`);
    console.log(`Time took per task(avg): ${Math.round(result / process.argv[3])}ms`);
    console.log(`Time took per task per thread (avg): ${Math.round((result / process.argv[3]) / process.argv[2])}ms`);
})();