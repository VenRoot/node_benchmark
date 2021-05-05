const { parentPort } = require("worker_threads");
const bcrypt = require("bcrypt");
parentPort.on('message', async(obj) => {
    return new Promise(resolve => {
        //console.dir(obj);
        const t0 = performance.now();
        for (let i = 0; i < 1000 / obj[0]; i++) {
            // file deepcode ignore HardcodedSecret: <Not needed for purpose>
            bcrypt.hashSync(Math.random().toString(), 10);
        }
        const t1 = performance.now();
        parentPort.postMessage(`W${obj[1]}: Hashing Math.random() ${1000/obj[0]} times with 10 salts took ${t1-t0}ms`);
        parentPort.close();
        resolve();
    });
});