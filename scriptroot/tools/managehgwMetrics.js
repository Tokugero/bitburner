import * as mg from './tools/manageGrafana.js';

/** @param {import("../common").NS} ns */
export async function main(ns) {
    const args = ns.flags([]);

    let key = args._[0];
    let keyValue = args._[1];
    let server = args._[2];
    let target = args._[3];
    let threads = args._[4];
    let time = args._[5];

    for (let i = 0; i < time; i = i + 10000) {
        await mg.submitMetrics(ns, key, keyValue,
            [
                { "name": `${keyValue}ing`, "value": threads },
                { "name": "server", "value": server },
                { "name": "target", "value": target }
            ]);
        await ns.sleep(10000);
    }
}