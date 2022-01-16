/** @param {import("../../common").NS} ns */

export async function main(ns) {
	const args = ns.flags([["help", false]]);
	var hostname = args._[0];
    while (true) {
		await hgw(ns, hostname);
		await ns.sleep(100);
	};
}

/** @param {import("../../common").NS} ns */

export async function hgw(ns, hostname) {
	if (ns.getServerSecurityLevel(hostname) > ns.getServerMinSecurityLevel(hostname) + 0.05) {
		await ns.weaken(hostname);
	} else if (ns.getServerMoneyAvailable(hostname) < ns.getServerMaxMoney(hostname) * 0.9) {
		await ns.grow(hostname);
	} else {
		var stolen = await ns.hack(hostname);
		ns.print(`Stole ${stolen} from ${hostname}`);
	};
}