import * as mapServers from './tools/mapServers.js';
import { url } from '.env.js';
import { hackLoop } from './hacks/hackLoop.js';
import { growLoop } from './hacks/growLoop.js';
import { weakenLoop } from './hacks/weakenLoop.js';

/*

This daemon is spawned on every node that isn't hacking itself. It should call a function
or check a control file to make a decision on where to hack/grow/weaken next and at what
depth.

*/

/** @param {import("../../common").NS} ns */

export async function main(ns) {
    const thisHost = ns.getServer(ns.getHostname());
    while (true) {
        if (thisHost.maxRam < 1024){
            var worstServer = await rando(ns);
            await nodehgw(ns, thisHost, worstServer);
        } else {
            let worstServers = await topN(ns, Math.floor(thisHost.maxRam/1024));
            await distributedNodehgw(ns, thisHost, worstServers);
        }
    };
}

/** @param {import("../../common").NS} ns */

export async function nodehgw(ns, server, target) {
    let cont = true;
    const hgwRam = 2;

    while (cont) {
        target = ns.getServer(target.hostname);
        await ns.wget(`${url}target=${target.hostname}&moneyMax=${target.moneyMax}&moneyAvailable=${target.moneyAvailable}&minDifficulty=${target.minDifficulty}&hackDifficulty=${target.hackDifficulty}`, `/dev/null.txt`);

        ns.print(`Starting new loop\n${"-".repeat(80)} \n\t$ = ${target.moneyAvailable}/${target.moneyMax} \n\tSecurity = ${target.minDifficulty}/${target.hackDifficulty}`);
        let freeThreads = Math.floor((server.maxRam - server.ramUsed) / hgwRam);

        if (server.hostname == "home") {
            if (server.maxRam < 32) {
                ns.tprint("You don't have a lot of ram, some of this may not work as expected. Upgrade to at least 32 asap!");
                freeThreads = Math.floor((server.maxRam - ramUsed) / hgwRam);
            }
            freeThreads = Math.floor((server.maxRam - 24) / hgwRam); // 2 = ram usage of hack/grow/weaken.js. 24 = headroom for this script + ctrl loop
        };

        // TODO: Centralize this decision to a single server rather than each node invoking it. 

        // Significantly drop security to get it ripe for pickin'
        if (target.hackDifficulty > (target.minDifficulty + 1) || server.maxRam < 16) {
            await weakenLoop(ns, server, target, freeThreads);

            // Start massively increasing money available, run security weakeners in tandem
        } else if (target.moneyAvailable < target.moneyMax * 0.9 && server.maxRam >= 16) {
            await growLoop(ns, server, target, freeThreads);

            // Do the hacking, run security weakeners in tandem
        } else if (server.maxRam >= 16) {
            await hackLoop(ns, server, target, freeThreads);

        } else {
            await ns.sleep(100); // to prevent too aggressive loops from small hosts.
        };
    };
}

/** @param {import("../../common").NS} ns */

export async function distributedNodehgw(ns, server, targets) {
    let cont = true;
    const hgwRam = 2;

    while (cont) {
        for (let target of targets){
            target = ns.getServer(target.hostname);
            target.maxRam = Math.floor(target.maxRam/(target.maxRam/1024)); // This is to get the amount of ram, divided by the split assumed by calling this script, and set it for the remainder
            await ns.wget(`${url}target=${target.hostname}&moneyMax=${target.moneyMax}&moneyAvailable=${target.moneyAvailable}&minDifficulty=${target.minDifficulty}&hackDifficulty=${target.hackDifficulty}`, `/dev/null.txt`);

            ns.print(`Starting new loop\n${"-".repeat(80)} \n\t$ = ${target.moneyAvailable}/${target.moneyMax} \n\tSecurity = ${target.minDifficulty}/${target.hackDifficulty}`);
            let freeThreads = Math.floor((server.maxRam - server.ramUsed) / hgwRam);

            if (server.hostname == "home") {
                if (server.maxRam < 32) {
                    ns.tprint("You don't have a lot of ram, some of this may not work as expected. Upgrade to at least 32 asap!");
                    freeThreads = Math.floor((server.maxRam - ramUsed) / hgwRam);
                }
                freeThreads = Math.floor((server.maxRam - 24) / hgwRam); // 2 = ram usage of hack/grow/weaken.js. 24 = headroom for this script + ctrl loop
            };

            // Significantly drop security to get it ripe for pickin'
            if (target.hackDifficulty > (target.minDifficulty + 1)) {
                ns.exec("/hacks/weakenLoop.js", server.hostname, 1, server.hostname, target.hostname, freeThreads);
                await ns.sleep(ns.getWeakenTime(target.hostname));
                
                // Start massively increasing money available, run security weakeners in tandem
            } else if (target.moneyAvailable < target.moneyMax * 0.9) {
                ns.exec("/hacks/growLoop.js", server.hostname, 1, server.hostname, target.hostname, freeThreads);
                await ns.sleep(ns.getGrowTime(target.hostname));

                // Do the hacking, run security weakeners in tandem
            } else if (server.maxRam) {
                ns.exec("/hacks/hackLoop.js", server.hostname, 1, server.hostname, target.hostname, freeThreads);
                await ns.sleep(ns.getHackTime(target.hostname));

            } else {
                await ns.sleep(100); // to prevent too aggressive loops from small hosts.
            };
        };
    };
}

/** @param {import("../../common").NS} ns */

async function rando(ns) {
    var allServers = await mapServers.getAllServers(ns);
    let mostMoney = ns.getServer("n00dles");

    for (const server of allServers) {
        if (!server.purchasedByPlayer && server.moneyAvailable > 0 && server.hasAdminRights && server.moneyMax > mostMoney.moneyMax) {
            mostMoney = server;
        }
    }
    return mostMoney;
}

/** @param {import("../../common").NS} ns */

async function topN(ns, splits) {
    let allServers = await mapServers.getAllServers(ns);
    allServers.sort(function(a, b) {
        let keyA = a.moneyMax;
        let keyB = b.moneyMax;
        if (!a.purchasedByPlayer && a.moneyAvailable > 0 && a.hasAdminRights && !b.purchasedByPlayer && b.moneyAvailable > 0 && b.hasAdminRights){
            if (keyA > keyB) return -1;
            if (keyA < keyB) return 1;
            return 0;
        };
    });
    return allServers.slice(0,splits);
};
