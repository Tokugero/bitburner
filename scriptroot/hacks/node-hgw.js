import * as mapServers from './tools/mapServers.js';
import * as env from '.env.js';
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
    if (thisHost.maxRam < env.bigWeight) {
        var worstServer = await rando(ns);
        await nodehgw(ns, thisHost, worstServer);
    } else {
        let worstServers = await topN(ns, Math.floor(thisHost.maxRam / env.bigWeight));
        await distributedNodehgw(ns, thisHost, worstServers);
    };
}

/** @param {import("../../common").NS} ns */

// Simplified loop for early game and small systems (<bigWeightGB)
export async function nodehgw(ns, server, target) {
    let cont = true;

    while (cont) {
        target = ns.getServer(target.hostname);
        await ns.wget(`${env.url}target=${target.hostname}&moneyMax=${target.moneyMax}&moneyAvailable=${target.moneyAvailable}&minDifficulty=${target.minDifficulty}&hackDifficulty=${target.hackDifficulty}`, `/dev/null.txt`);

        ns.print(`Starting new loop\n${"-".repeat(80)} \n\t$ = ${target.moneyAvailable}/${target.moneyMax} \n\tSecurity = ${target.minDifficulty}/${target.hackDifficulty}`);
        let freeThreads = Math.floor((server.maxRam - server.ramUsed) / env.hgwMemoryBuffer);

        if (server.hostname == "home") {
            if (server.maxRam < env.homehgwBuffer) {
                ns.tprint("You don't have a lot of ram, some of this may not work as expected. Upgrade to at least 32 asap!");
                freeThreads = Math.floor((server.maxRam - ramUsed) / env.hgwMemoryBuffer);
            }
            freeThreads = Math.floor((server.maxRam - eng.homehgwBuffer) / env.hgwMemoryBuffer); // 2 = ram usage of hack/grow/weaken.js. 24 = headroom for this script + ctrl loop
        };

        // Significantly drop security to get it ripe for pickin'
        if (target.hackDifficulty > (target.minDifficulty + 1) || server.maxRam < env.hostMemoryFloor) {
            await weakenLoop(ns, server, target, freeThreads);

            // Start massively increasing money available, run security weakeners in tandem
        } else if (target.moneyAvailable < target.moneyMax * env.moneyBuffer && server.maxRam >= env.hostMemoryFloor) {
            await growLoop(ns, server, target, freeThreads);

            // Do the hacking, run security weakeners in tandem
        } else if (server.maxRam >= env.hostMemoryFloor) {
            await hackLoop(ns, server, target, freeThreads);

        } else {
            await ns.sleep(100); // to prevent too aggressive loops from small hosts.
        };
    };
}

/** @param {import("../../common").NS} ns */

export async function distributedNodehgw(ns, server, targets) {
    for (let target of targets) {
        ns.exec("/hacks/loopController.js", server.hostname, 1, server.hostname, target.hostname);
        ns.exec("/hacks/shareLoop.js", server.hostname);
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
    let filteredServers = [];
    for (const server of allServers) {
        if (!server.purchasedByPlayer && server.moneyAvailable > 0 && server.hasAdminRights) {
            filteredServers.push(server);
        }
    }
    filteredServers.sort(function (a, b) {
        let keyA = a.moneyMax;
        let keyB = b.moneyMax;
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return 0;
    });
    return filteredServers.slice(0, splits);
};
