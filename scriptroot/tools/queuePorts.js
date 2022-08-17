import * as env from '.env.js';
import * as ms from './tools/mapServers.js';

/** @param {import("../common").NS} ns */
export async function main(ns) {
    await cacheServers(ns);
    ns.sleep(10000);
};

/** @param {import("../common").NS} ns */
export async function peekQueue(ns, port) {
    for (let i = 0; i < 3; i++) {
        if (ns.peek(port) != "NULL PORT DATA") {
            const parsed = JSON.parse(ns.peek(port));
            ns.print(parsed);
            return parsed;
        } else {
            ns.print("Retrying peek... " + port);
            ns.sleep(100);
        }
    }
    ns.print("Failed to peek queue " + port);
    return [];
}

/** @param {import("../common").NS} ns */
export async function cacheServers(ns) {
    const serverListPort = ns.getPortHandle(env.serverListQueue);

    let servers = await ms.getAllServers(ns);

    ns.print("Clearing server list queue");
    serverListPort.clear();

    ns.print("Storing servers in cache.");
    serverListPort.write(JSON.stringify(servers));
    ns.print("Done storing " + servers.length + " servers in cache.");

    return serverListPort;
};