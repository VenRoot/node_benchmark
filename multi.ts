import {performance} from "perf_hooks";
import {Worker} from "worker_threads";
import fs from "fs";

const d:number[] = [];
import os from "os";
let result = 0;

const nodev = Number(process.versions.node.split('.'));

if (nodev < 16) {
    console.error(`It is not recommended to use a node version less than 16, your version: ${process.versions.node}\n\nPlease upgrade node using npm install -g node@latest`);
    process.exit(1);
}


if (process.argv[3] === undefined) {
    process.argv[3] = "10";
    console.warn("No argument for tasks. Defaults to 10")
}

if (process.argv[2] === undefined) {
    process.argv[2] = (os.cpus().length / 2).toString();
    console.warn("No value given for cpu threads, defaults to half = " + os.cpus().length);
}

if(Number(process.argv[2]) > os.cpus().length-1)
{
    console.log(`More threads requested than avaiable!, please chookse less than ${os.cpus().length-1}`);
    process.exit(1);
}

const num = Number(process.argv[2]);

(async function() {
    //console.log(num);
    for (let i = 0; i < Number(process.argv[3]); i++) {
        const workers:Worker[] = [];
        switch (true) {
            case (num > 0):
            // case (num < 16):
                for (let o = 0; o < num; o++) {
                    workers.push(new Worker(`./workers/worker${num}.js`));
                }
                break;
            default:
                throw ("Ungültige Nummer");
        }
        let P:Promise<void>[] = [];
        workers.forEach((w, i) => {
            P.push(new Promise<void>(resolve => { w.on("exit", () => resolve()) }).catch(e => { throw e; }));
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
    console.log(`Time took per task(avg): ${Math.round(result / Number(process.argv[3]))}ms`);
    console.log(`Time took per task per thread (avg): ${Math.round((result / Number(process.argv[3])) / Number(process.argv[2]))}ms`);
})();


const createFiles = async () =>
{
    console.log("Creating Files... please wait...");
    let file = fs.readFileSync("./workerfile.js");
    console.log("Template read...");

    for(let i = 0; i < Number(process.argv[2]); i++)
    {
        fs.writeFileSync(`./workers/worker${i}.js`, file);
        console.log(`Worker ${i} created`);
    }
    console.log(`All Workers successfully created`);
    return;

}