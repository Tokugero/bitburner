import * as qp from './tools/queuePorts.js';

/** @param {import("../../common").NS} ns */
export async function main(ns) {
    await qp.cacheServers(ns);
    ns.spawn('tools/manageCache.js');
}