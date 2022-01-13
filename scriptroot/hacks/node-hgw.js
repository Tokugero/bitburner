import * as mapServers from './tools/mapServers.js';

/** @param {import("../../common").NS} ns */

export async function main(ns) {
    while (true) {
        
        var worstServer = await rando(ns);
        
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

async function rando(ns) {
    var allServers = await mapServers.getAllServers(ns);
    var eligibleServers = [];
    for (const server of allServers){
        if (!server.purchasedByPlayer && server.moneyAvailable > 0 && server.hasAdminRights ){
            eligibleServers.push(server);
        }
    }
    var randomServer = eligibleServers[Math.floor(Math.random() * eligibleServers.length)];

    return randomServer;
}