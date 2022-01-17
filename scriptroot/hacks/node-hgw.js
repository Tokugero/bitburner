import * as mapServers from './tools/mapServers.js';
import { url, secret } from '.env.js';

/*

This daemon is spawned on every node that isn't hacking itself. It should call a function
or check a control file to make a decision on where to hack/grow/weaken next and at what
depth.

*/

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
        let freeThreads = Math.floor((server.maxRam-server.ramUsed) / 2);
        if (server.hostname == "home"){
            if (server.maxRam < 32) {
                ns.tprint("You don't have a lot of ram, some of this may not work as expected. Upgrade to at least 32 asap!");
                freeThreads = Math.floor((server.maxRam-ramUsed) / 2);
            }
            freeThreads = Math.floor((server.maxRam-24) / 2); // 2 = ram usage of hack/grow/weaken.js. 14 = headroom for this script + ctrl loop
        };
        
        if (target.hackDifficulty > target.minDifficulty + 0.05) {
            ns.exec("hacks/weaken.js", server.hostname, freeThreads, target.hostname);
            await ns.wget(`${url}/?secret=${secret}&processes=1&hacking=0&growing=0&weakening=${freeThreads}`, `/dev/null.txt`);
            await ns.sleep(ns.getWeakenTime(target.hostname)+100);
        } else if (target.moneyAvailable < target.moneyMax * 0.9) {
            ns.exec("hacks/grow.js", server.hostname, freeThreads, target.hostname);
            await ns.wget(`${url}/?secret=${secret}&processes=1&hacking=0&growing=${freeThreads}&weakening=0`, `/dev/null.txt`);
            await ns.sleep(ns.getGrowTime(target.hostname)+100);
        } else {
            ns.exec("hacks/hack.js", server.hostname, freeThreads, target.hostname);
            await ns.wget(`${url}/?secret=${secret}&processes=1&hacking=${freeThreads}&growing=0&weakening=0`, `/dev/null.txt`);
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