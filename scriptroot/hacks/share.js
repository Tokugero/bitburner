/*

Consume some remaining unused headroom of servers for faction rep gain.

*/
/** @param {import("../common").NS} ns */

export async function main(ns) {
    let thisServer = ns.getServer();
    let threads = (thisServer.maxRam - thisServer.ramUsed) * .1 
    if (thisServer.maxRam > 16){
        await ns.share();
        ns.spawn("tools/share.js", threads);
    };
}