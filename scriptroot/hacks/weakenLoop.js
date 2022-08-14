import * as env from '.env.js';

/** @param {import("../../common").NS} ns */

export async function main(ns) {
    const args = ns.flags([]);

    let server = ns.getServer(args._[0]);
    let target = ns.getServer(args._[1]);
    let freeThreads = args._[2];

    await weakenLoop(ns, server, target, freeThreads);
}

/** @param {import("../../common").NS} ns */

export async function weakenLoop(ns, server, target, freeThreads) {
    let minSleep = ns.getWeakenTime(target.hostname);

    ns.print(`${target.hostname} currently at ${target.hackDifficulty} difficulty (min is ${target.minDifficulty})\nEntering weaken loop.`);
    ns.exec("hacks/weaken.js", server.hostname, freeThreads, target.hostname);
    await ns.wget(`${env.url}hgw=weaken&weakening=${freeThreads}&server=${server.hostname}`, `/dev/null.txt`);
    ns.print(`Max weaken sleeping for ${(minSleep / 1000 / 60)}`);
    await ns.sleep(minSleep + 1000);

    await ns.wget(`${env.url}hgw=weaken&weakening=-${freeThreads}&server=${server.hostname}`, `/dev/null.txt`);
}
