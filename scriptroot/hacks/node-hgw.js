import * as mapServers from './tools/mapServers.js';
//import * as manageServer from './tools/manageServer.js';

/** @param {import("../../common").NS} ns */

export async function main(ns) {
    while (true) {
        var worstServer = await rando(ns); 
        await nodehgw(ns, ns.getServer(ns.getHostname()), worstServer);
	};
}

/** @param {import("../../common").NS} ns */

export async function nodehgw(ns, server, target) {
    var cont = true;
    while(cont){
        const freeThreads = Math.floor((server.maxRam-8) / 1.75); // 1.75 = ram usage of hack/grow/weaken.js. 6 = headroom
        if (target.hackDifficulty > target.minDifficulty + 0.05) {
            ns.exec("hacks/weaken.js", server.hostname, freeThreads, target.hostname);
            await ns.sleep(ns.getWeakenTime(target.hostname)+100);
        } else if (target.moneyAvailable < target.moneyMax * 0.9) {
            ns.exec("hacks/grow.js", server.hostname, freeThreads, target.hostname);
            await ns.sleep(ns.getGrowTime(target.hostname)+100);
        } else {
            ns.exec("hacks/hack.js", server.hostname, freeThreads, target.hostname);
            await ns.sleep(ns.getHackTime(target.hostname)+100);
            cont = false;
        }
    };
}

/** @param {import("../../common").NS} ns */

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