import * as env from '.env.js';

/*

Consume some remaining unused headroom of servers for faction rep gain.

*/
/** @param {import("../common").NS} ns */

export async function main(ns, threads, hostname) {
    await ns.share();
    ns.spawn("/hacks/share.js", hostname, threads, threads, hostname);
}