import * as env from '.env.js';

/*

Consume some remaining unused headroom of servers for faction rep gain.

*/
/** @param {import("../common").NS} ns */

export async function main(ns) {
    let thisServer = ns.getServer();
    let threads = (thisServer.maxRam * env.shareBuffer) / 8

    await shareLoop(ns, threads, thisServer.hostname);
}

/** @param {import("../common").NS} ns */

export async function shareLoop(ns, threads, hostname) {
    ns.print(`Entering Share loop.`);

    ns.spawn("hacks/share.js", threads, threads, hostname);
    await ns.sleep(100);

}