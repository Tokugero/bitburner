import * as ms from './tools/mapServers.js';
import * as qp from './tools/queuePorts.js';
import * as env from '.env.js';

/** @param {import("../../common").NS} ns */
export async function main(ns) {
    await cacheServers(ns);
    await updateDB(ns, env.bigHackingDB, env.bigHackingIPQueue, "server");
    await updateDB(ns, env.smallHackingDB, env.smallHackingIPQueue, "server");
    await ns.sleep(15000);
    await ns.spawn('tools/manageCache.js');
};

/** @param {import("../common").NS} ns */
export async function cacheServers(ns) {
    let servers = await ms.getAllServers(ns);
    ns.print("Clearing server list queue");
    qp.clearQueue(ns, env.serverListQueue);

    ns.print("Storing servers in cache.");
    await qp.writeQueue(ns, env.serverListQueue, servers);
    ns.print("Done storing " + servers.length + " servers in cache.");
};

/** @param {import("../common").NS} ns */
async function updateDB(ns, db, queue, index) {
    let dbObject = await qp.peekQueue(ns, db);

    while (true) {
        let row = await qp.readQueue(ns, queue);
        if (row != "NULL PORT DATA") {
            if (dbObject = "NULL PORT DATA") { dbObject = {}; }
            if (dbObject[row[index].hostname] === undefined) {
                dbObject[row[index].hostname] = [row];
            } else {
                if (dbObject = "NULL PORT DATA") { dbObject = {}; }
                dbObject[row[index].hostname].push(row);
            }
        } else { break; };
    }

    await qp.clearQueue(ns, db);
    await qp.writeQueue(ns, db, dbObject);
};
