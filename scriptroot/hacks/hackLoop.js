import * as env from '.env.js';
import * as mg from 'tools/manageGrafana.js';
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
    let effectThreads = Math.ceil(Math.ceil(freeThreads * env.effectBuffer), ns.hackAnalyzeThreads(target.hostname, target.moneyAvailable * env.effectBuffer));
    let weakenThreads = Math.ceil(freeThreads * env.weakenBuffer);

    ns.print(`Entering Hack loop.`);
    ns.exec("/hacks/weaken.js", server.hostname, weakenThreads, target.hostname);

    ns.exec("tools/managehgwMetrics.js", server.hostname, 1, "hgw", "weaken", server.hostname, target.hostname, weakenThreads, maxSleep - minSleep);
    ns.print(`Hack sleeping for ${(maxSleep - minSleep / 1000 / 60)}`);
    await ns.sleep(maxSleep - minSleep);

    ns.exec("tools/managehgwMetrics.js", server.hostname, 1, "hgw", "hack", server.hostname, target.hostname, effectThreads, minSleep + 10000);
    ns.exec("/hacks/hack.js", server.hostname, effectThreads, target.hostname);
    // Offset the script runtime so that weaken finishes immediately after
    ns.print(`Hack sleeping for ${(minSleep / 1000 / 60)}`);
    await ns.sleep(minSleep + 10000);
}
