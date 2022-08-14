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
    let effectThreads = Math.floor(freeThreads * env.effectBuffer);
    let weakenThreads = Math.ceil(freeThreads * env.weakenBuffer);

    ns.print(`Entering Grow loop.`);
    ns.exec("hacks/weaken.js", server.hostname, weakenThreads, target.hostname);
    await ns.wget(`${env.url}hgw=weaken&weakening=${weakenThreads}&server=${server.hostname}`, `/dev/null.txt`);
    ns.print(`Grow sleeping for ${(maxSleep - minSleep / 1000 / 60)}`);
    await ns.sleep(maxSleep - minSleep);
    await ns.wget(`${env.url}hgw=weaken&weakening=-${weakenThreads}&server=${server.hostname}`, `/dev/null.txt`);

    ns.print(`${target.hostname} currently at ${target.moneyAvailable} money (max is ${target.moneyMax})`);
    ns.exec("hacks/grow.js", server.hostname, effectThreads, target.hostname);
    await ns.wget(`${env.url}hgw=grow&growing=${effectThreads}&server=${server.hostname}`, `/dev/null.txt`);
    // Offset the script runtime so that weaken finishes immediately after
    ns.print(`Grow sleeping for ${(minSleep / 1000 / 60)}`);
    await ns.sleep(minSleep + 10000);
    await ns.wget(`${env.url}hgw=grow&growing=-${effectThreads}&server=${server.hostname}`, `/dev/null.txt`);
}
