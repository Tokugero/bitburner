import * as mapServers from './tools/mapServers.js';
import * as hgw from './hacks/hgw.js';

/** @param {import("../../common").NS} ns */

export async function main(ns) {
    var allServers = await mapServers.getAllServers(ns);
    while (true) {
        var worstServer = ns.getServer("foodnstuff");
        for (const server of allServers) {
            if ( server.hasAdminRights && server.getServerMaxMoney > 1 && worstServer.serverGrowth < server.serverGrowth) {
                worstServer = server;
            };
        };
        await nodehgw(ns, worstServer.hostname);
	};
}

export async function nodehgw(ns, hostname) {
	if (ns.getServerSecurityLevel(hostname) > ns.getServerMinSecurityLevel(hostname) + 0.05) {
		await ns.weaken(hostname);
	} else if (ns.getServerMoneyAvailable(hostname) < ns.getServerMaxMoney(hostname) * 0.9) {
		await ns.grow(hostname);
	} else {
		var stolen = await ns.hack(hostname);
		ns.toast(`Stole ${stolen} from ${hostname}`);
	};
}