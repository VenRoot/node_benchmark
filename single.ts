import { Worker } from "worker_threads";
import * as bcrypt from "bcrypt";
import { performance } from "perf_hooks";
const d:number[] = [];

let result = 0;


let num = Number(process.argv[2]);
if (process.argv[2] === undefined) {
    (process.argv[2] as any) = num = 10;
    console.warn("No argument for tasks. Defaults to 10")
}

const settings = {

}


type Workers = Worker[];
const Workers:Workers = [];



const x = () => {
    return new Promise<string>(resolve => {
        const t0 = performance.now();
        for (let i = 0; i < 1000; i++) {
            // file deepcode ignore HardcodedSecret: <Not needed for purpose>
            bcrypt.hashSync(Math.random().toString(), 10);
        }
        const t1 = performance.now();
        resolve(`Hashing Math.random() 1000 times with 10 salts took ${t1-t0}ms`);
    });
}
(async function() {
    for (let i = 0; i < num; i++) {
        /**Still declared workers to equalize the work */
        const worker1 = new Worker('./worker1.js');
        const worker2 = new Worker('./worker2.js');
        const worker3 = new Worker('./worker3.js');
        let P = [
            new Promise(async resolve => { await x().catch(e => { throw e; }).then(() => { resolve(undefined); }) })
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
    console.log(`Time took per task(avg): ${Math.round(result/parseInt(process.argv[2]))}m`);
})();