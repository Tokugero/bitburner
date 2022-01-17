/*

This daemon init process is responsible for any actions involved in establishing
the hacknet and eventually the hacknodes.

*/

/** @param {import("../../common").NS} ns */

export async function startBuying(ns) {
    ns.exec('tools/manageHacknet.js', 'home', 1);
}