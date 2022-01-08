/** @param {import("../../common").NS} ns */

// Example hacking script.

export async function main(ns) {
    var hostname = ns.getHostname();

	while(true){
		await ns.hack(hostname);
		await ns.grow(hostname);
		await ns.weaken(hostname);
	};
}