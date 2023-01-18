import * as env from '.env.js';
import * as qp from './tools/queuePorts.js';

/** @param {import("../common").NS} ns */
export async function main(ns) {
    const server = ns.getServer();

    if (server.maxRam < 128 && server.maxRam > 64) {
        ns.print(`Server ${server.hostname} has less than 128GB of RAM.`);
        // earlyGame
        while (true) {
            if (! await earlyGame(ns)) {
                break;
            };
        };
    } else if (server.maxRam < 512) {
        ns.print(`Server ${server.hostname} has less than 512GB of RAM.`);
        while (true) {
            if (! await midGame(ns)) {
                break;
            };
        };
        // midGame
    } else if (server.maxRam < 4096) {
        ns.print(`Server ${server.hostname} has less than 4096GB of RAM.`);
        // lateGame
        while (true) {
            if (! await midGame(ns)) {
                break;
            };
        };
    } else {
        ns.print(`Server ${server.hostname} has more than 4096GB of RAM.`);
        // endGame
        while (true) {
            if (! await midGame(ns)) {
                break;
            };
        };
    }
    await ns.spawn("tools/sleeves/manageSleeves.js", 1);
}

/** @param {import("../common").NS} ns */
export async function earlyGame(ns) {
    let cont = true
    const sleeves = await qp.peekQueue(ns, env.sleeveQueue);

    for (const sleeve in sleeves) {
        if (sleeve >= env.reservedSleeves && sleeves[sleeve].task.crime != "Larceny") {
            await ns.sleeve.setToCommitCrime(sleeve, "Larceny")
        }
    }
    await ns.sleep(10000);
    return cont
}

/** @param {import("../common").NS} ns */
export async function midGame(ns) {
    let cont = true
    const sleeves = await qp.peekQueue(ns, env.sleeveQueue);

    for (const sleeve in sleeves) {
        if (sleeve >= env.reservedSleeves && sleeves[sleeve].task.crime != "Traffick Arms") {
            await ns.sleeve.setToCommitCrime(sleeve, "Traffick Arms")
        }
    }
    await ns.sleep(10000);
    return cont
}

/** @param {import("../common").NS} ns */
export async function lateGame(ns) { }

/** @param {import("../common").NS} ns */
export async function endGame(ns) { }
