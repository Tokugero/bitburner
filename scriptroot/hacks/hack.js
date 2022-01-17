/*

Standalone, inexpensive, script to be called on its own to maximize the threads consumed. Any decision
logic should be made outside of this script as a handler as threads are calculated as 
sum-of-all-functions * thread count.

*/

/** @param {import("../../common").NS} ns */

export async function main(ns) {
    const args = ns.flags([]);
    let stolen = await ns.hack(args._[0]);
	ns.print(`Stole ${stolen} from ${args._[0]}`);
}