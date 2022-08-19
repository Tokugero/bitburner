import * as env from '.env.js';
import * as qp from './tools/queuePorts.js';

/*

Consume some remaining unused headroom of servers for faction rep gain.

*/
/** @param {import("../common").NS} ns */

export async function main(ns) {
    let thisServer = ns.getServer();
    let scriptRam = ns.getScriptRam("hacks/share.js", thisServer.hostname) + ns.getScriptRam("hacks/shareLoop.js", thisServer.hostname);
    let threads = Math.floor((thisServer.maxRam - parseInt(ns.read("/stats/reserved.js"))) / scriptRam);
    if (qp.peekQueue(ns, env.bigHackingQueue) != "NULL PORT DATA") {
        ns.spawn("node-hgw.js", 1);
    } else if (threads > 0) {
        ns.tprint(thisServer.hostname + " host is starting share");
        await shareLoop(ns, threads);
    }
}
/** @param {import("../common").NS} ns */

export async function shareLoop(ns, threads) {
    ns.spawn("hacks/share.js", threads, threads);
}