import * as mg from './tools/manageGrafana.js';
import * as env from '.env.js';

/** @param {import("../../common").NS} ns */
export async function main(ns) {
    const args = ns.flags([]);

    let server = ns.getServer(args._[0]);
    let target = ns.getServer(args._[1]);
    let freeThreads = args._[2];

    await growLoop(ns, server, target, freeThreads);
}

/** @param {import("../../common").NS} ns */
export async function growLoop(ns, server, target, freeThreads) {
    let growTime = ns.getGrowTime(target.hostname);
    let weakenTime = ns.getWeakenTime(target.hostname);
    let maxSleep = Math.max(growTime, weakenTime);
    let minSleep = Math.min(growTime, weakenTime);
    let effectThreads = Math.ceil(freeThreads * env.effectBuffer);
    let weakenThreads = Math.ceil(freeThreads * env.weakenBuffer);

    ns.print(`Entering Grow loop.`);
    ns.exec("hacks/weaken.js", server.hostname, weakenThreads, target.hostname);
    ns.print(`Grow sleeping for ${(maxSleep - minSleep / 1000 / 60)}`);
    ns.exec("tools/managehgwMetrics.js", server.hostname, 1, "hgw", "weaken", server.hostname, target.hostname, weakenThreads, maxSleep - minSleep);
    await ns.sleep(maxSleep - minSleep);

    ns.print(`${target.hostname} currently at ${target.moneyAvailable} money (max is ${target.moneyMax})`);
    ns.exec("hacks/grow.js", server.hostname, effectThreads, target.hostname);
    ns.exec("tools/managehgwMetrics.js", server.hostname, 1, "hgw", "grow", server.hostname, target.hostname, effectThreads, minSleep + 10000);
    // Offset the script runtime so that weaken finishes immediately after
    ns.print(`Grow sleeping for ${(minSleep / 1000 / 60)}`);
    await ns.sleep(minSleep + 10000);
}
