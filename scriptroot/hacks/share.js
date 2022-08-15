import * as env from '.env.js';

/*

Consume some remaining unused headroom of servers for faction rep gain.

*/
/** @param {import("../common").NS} ns */

export async function main(ns) {
    const args = ns.flags([]);

    const threads = args._[0];
    const hostname = args._[1];

    await ns.share();

    ns.spawn("hacks/share.js", threads, threads, hostname);
}