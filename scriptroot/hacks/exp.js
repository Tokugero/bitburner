/*

Consume some remaining unused headroom of servers for faction rep gain.

*/
/** @param {import("../common").NS} ns */
export async function main(ns) {
    const args = ns.flags([]);

    const threads = args._[0];

    await ns.grow("joesguns");

    await ns.spawn("hacks/exp.js", threads, threads);
}