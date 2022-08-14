import * as env from '.env.js';

/*

Consume some remaining unused headroom of servers for faction rep gain.

*/
/** @param {import("../common").NS} ns */

export async function main(ns) {
    let thisServer = ns.getServer();
    let threads = (thisServer.maxRam * env.shareBuffer) / 8
    await ns.share();
    ns.spawn("hacks/share.js", threads);
}