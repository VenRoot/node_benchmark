const { Worker } = require("worker_threads");

const d = [];

const os = require("os");
let result = 0;


const num = Number(process.argv[2]);
if (process.argv[3] === undefined) {
    process.argv[3] = 10;
    console.warn("No argument for tasks. Defaults to 10")
}

if (process.argv[2] === undefined) {
    process.argv[2] = os.cpus().length / 2;
    console.warn("No value given for cpu threads, defaults to half = " + os.cpus().length);
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
        let P = [];
        workers.forEach((w, i) => {
            P.push(new Promise(resolve => { w.on("exit", () => resolve()) }).catch(e => { throw e; }));
        })
        const t0 = performance.now();

        workers.forEach((w, i) => {
            w.postMessage([num, i + 1]); //w präsentiert das Objekt. console.log => w.log(i);
        });
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