import * as qp from './tools/queuePorts.js';
import * as env from '.env.js';

// Random common utilities

/** @param {import("../../common").NS} ns */
export async function getServers(ns) { };

/** @param {import("../../common").NS} ns */
export async function getServerDetails(ns) { };

/** @param {import("../../common").NS} ns */
export async function topN(ns, splits, allServers = []) {
    let filteredServers = [];

    if (allServers.length == 0) {
        allServers = await qp.peekQueue(ns, env.serverListQueue);
        for (const server of allServers) {
            if (!server.purchasedByPlayer && server.moneyAvailable >= 0 && server.hasAdminRights) {
                filteredServers.push(server);
            }
        }
    };

    filteredServers.sort(function (a, b) {
        let keyA = a.moneyMax;
        let keyB = b.moneyMax;
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return 0;
    });
    return filteredServers.slice(0, splits);
};
