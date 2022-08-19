import * as env from '.env.js';

/*

Consume some remaining unused headroom of servers for faction rep gain.

*/
/** @param {import("../common").NS} ns */

export async function main(ns) {
    let thisServer = ns.getServer();
    let scriptRam = ns.getScriptRam("/hacks/exp.js", thisServer.hostname) + ns.getScriptRam("/hacks/expLoop.js", thisServer.hostname);
    let threads = Math.floor((thisServer.maxRam - parseInt(ns.read("/stats/reserved.js"))) / scriptRam);
    if (threads > 0) {
        await expLoop(ns, threads);
    }
}

/** @param {import("../common").NS} ns */

export async function expLoop(ns, threads) {
    ns.spawn("hacks/exp.js", threads, threads);
}