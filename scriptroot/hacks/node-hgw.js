import * as env from '.env.js';
import { hackLoop } from './hacks/hackLoop.js';
import { growLoop } from './hacks/growLoop.js';
import { weakenLoop } from './hacks/weakenLoop.js';
import * as qp from './tools/queuePorts.js';
import * as utils from './tools/utils.js';


/*

This daemon is spawned on every node that isn't hacking itself. It should call a function
or check a control file to make a decision on where to hack/grow/weaken next and at what
depth.

*/

/** @param {import("../../common").NS} ns */
export async function main(ns) {
    const thisHost = ns.getServer(ns.getHostname());

    if (thisHost.maxRam < env.bigWeight) {
        let worstServer = await rando(ns);
        await nodehgw(ns, thisHost, worstServer);

    } else if (!env.hackQueue) {
        let worstServers = await utils.topN(ns, Math.floor(thisHost.maxRam / env.bigWeight));
        await distributedNodehgw(ns, thisHost, worstServers);

    } else if (env.hackQueue) {
        let servers = [];
        while (true) {
            const server = await qp.readQueue(ns, env.bigHackingQueue)
            if (server == "NULL PORT DATA") { break; }
            else {
                let reserved = parseInt(ns.read("/stats/reserved.js", server.hostname));
                if (!reserved || reserved < 0) {
                    reserved = 0;
                    await ns.write("/stats/reserved.js", 0, "w");
                };

                const hackStaticRamCost = Math.floor(.1 * 10 * env.hgwMemoryBuffer); // This is to convert to a static number of hack "threads", which neeeds to be converted to the actual hack script
                const hackMem = ns.hackAnalyzeThreads(server.hostname, server.moneyMax) * hackStaticRamCost;
                if (hackMem <= thisHost.maxRam - reserved) {
                    servers.push(server);
                    reserved = reserved + hackMem;
                    await qp.writeQueue(ns, env.bigHackingIPQueue, { "target": server, "server": thisHost });
                    await ns.write("/stats/reserved.js", reserved, "w");
                } else { break; };
            }
        };
        await distributedNodehgw(ns, thisHost, servers);
    };
};

/** @param {import("../../common").NS} ns */
// Simplified loop for early game and small systems (<bigWeightGB)
export async function nodehgw(ns, server, target) {
    while (true) {
        target = ns.getServer(target.hostname);
        await ns.wget(`${env.url}target=${target.hostname}&moneyMax=${target.moneyMax}&moneyAvailable=${target.moneyAvailable}&minDifficulty=${target.minDifficulty}&hackDifficulty=${target.hackDifficulty}`, `/dev/null.txt`);

        ns.print(`Starting new loop\n${"-".repeat(80)} \n\t$ = ${target.moneyAvailable}/${target.moneyMax} \n\tSecurity = ${target.minDifficulty}/${target.hackDifficulty}`);
        let freeThreads = Math.floor((server.maxRam - server.ramUsed) / env.hgwMemoryBuffer);



        if (server.hostname == "home") {
            if (server.maxRam < env.homehgwBuffer) {
                ns.tprint("You don't have a lot of ram, some of this may not work as expected. Upgrade to at least " + env.homehgwBuffer + " asap!");
                freeThreads = Math.floor((server.maxRam - ramUsed) / env.hgwMemoryBuffer);
            }
            freeThreads = Math.floor((server.maxRam - env.homehgwBuffer) / env.hgwMemoryBuffer); // 2 = ram usage of hack/grow/weaken.js. 24 = headroom for this script + ctrl loop
        };

        if (freeThreads == 0) {
            freeThreads = 1;
        }

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
};

/** @param {import("../../common").NS} ns */
export async function distributedNodehgw(ns, server, targets) {
    if (targets.length > 0) {
        for (let target of targets) {
            ns.exec("hacks/loopController.js", server.hostname, 1, server.hostname, target.hostname, targets.length);
        };
    }
    if (server.purchasedByPlayer || server.hostname == "home") {
        ns.toast(server.hostname + " is moving to distribute.", "success");

        if (!env.endGame) {
            ns.exec("hacks/shareLoop.js", server.hostname);
        } else if (env.endGame) {
            ns.exec("hacks/expLoop.js", server.hostname);
        };
    }
};

/** @param {import("../../common").NS} ns */
async function rando(ns) {
    let allServers = await qp.peekQueue(ns, env.serverListQueue);
    let mostMoney = ns.getServer("n00dles");

    for (const server of allServers) {
        if (!server.purchasedByPlayer && server.moneyAvailable > 0 && server.hasAdminRights && server.moneyMax > mostMoney.moneyMax) {
            mostMoney = server;
        }
    }
    return mostMoney;
};

