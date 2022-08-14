import * as env from '.env.js';

/** @param {import("../../common").NS} ns */

export async function main(ns) {
    const args = ns.flags([]);

    let server = ns.getServer(args._[0]);
    let target = ns.getServer(args._[1]);
    let freeThreads = args._[2];

    await hackLoop(ns, server, target, freeThreads);
}

/** @param {import("../../common").NS} ns */

export async function hackLoop(ns, server, target, freeThreads) {
    let hackTime = ns.getHackTime(target.hostname);
    let weakenTime = ns.getWeakenTime(target.hostname);
    let maxSleep = Math.max(hackTime, weakenTime);
    let minSleep = Math.min(hackTime, weakenTime);
    let effectThreads = Math.floor(freeThreads * env.effectBuffer);
    let weakenThreads = Math.ceil(freeThreads * env.weakenBuffer);

    ns.print(`Entering Hack loop.`);
    ns.exec("hacks/weaken.js", server.hostname, weakenThreads, target.hostname);
    await ns.wget(`${env.url}hgw=weaken&weakening=${weakenThreads}&server=${server.hostname}`, `/dev/null.txt`);
    ns.print(`Hack sleeping for ${(maxSleep - minSleep / 1000 / 60)}`);
    await ns.sleep(maxSleep - minSleep);
    await ns.wget(`${env.url}hgw=weaken&weakening=-${weakenThreads}&server=${server.hostname}`, `/dev/null.txt`);

    ns.exec("hacks/hack.js", server.hostname, effectThreads, target.hostname);
    await ns.wget(`${env.url}hgw=hack&hacking=${effectThreads}&server=${server.hostname}`, `/dev/null.txt`);
    // Offset the script runtime so that weaken finishes immediately after
    ns.print(`Hack sleeping for ${(minSleep / 1000 / 60)}`);
    await ns.sleep(minSleep + 10000);
    await ns.wget(`${env.url}hgw=hack&hacking=-${effectThreads}&server=${server.hostname}`, `/dev/null.txt`);
}
