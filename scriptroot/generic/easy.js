/**
* @param {NS} ns
**/

export async function main(ns) {
    var hostname = ns.getHostname();

	while(true){
		await ns.hack(hostname);
		await ns.grow(hostname);
		await ns.weaken(hostname);
	};
}