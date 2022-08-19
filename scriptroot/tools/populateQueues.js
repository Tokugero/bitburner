import * as env from '.env.js';
import * as qp from './tools/queuePorts.js';
import * as utils from './tools/utils.js';

/** @param {import("../common").NS} ns */
export async function main(ns) {
    await loadHGW(ns);
}

/** @param {import("../common").NS} ns */
export async function loadHGW(ns) {
    const servers = await hackableServers(ns);

    qp.clearQueue(ns, env.bigHackingQueue);
    qp.clearQueue(ns, env.smallHackingQueue);
    qp.clearQueue(ns, env.bigHackingIPQueue);
    qp.clearQueue(ns, env.smallHackingIPQueue);

    for (const server of servers) {
        await qp.writeQueue(ns, env.bigHackingQueue, server);
    }

    await qp.writeQueue(ns, env.smallHackingQueue, await utils.topN(ns, 1, servers))
};


/** @param {import("../common").NS} ns */
async function hackableServers(ns) {
    const serverList = await qp.peekQueue(ns, env.serverListQueue);
    let ownedServers = [];

    for (const server of serverList) {
        if (server.hasAdminRights && !server.purchasedByPlayer && server.hostname != "home" && server.moneyAvailable > 0) {
            ownedServers.push(server);
        }
    }

    return ownedServers;
};