import * as qp from './tools/queuePorts.js';
import * as env from '.env.js'
/*

This file is responsible for replicating all /tools & /hacks from the home server
to all servers capable of receiving the files. This includes hackable servers and
purchasable nodes.

*/

/** @param {import("../common").NS} ns */

export async function main(ns) {
    await replicate(ns);
    await hack(ns);
}

/** @param {import("../common").NS} ns */

export async function replicate(ns) {
    const allServers = await qp.peekQueue(ns, env.serverListQueue);
    ns.print(allServers + " read from cache.");
    let files = ns.ls("home", "/hacks/");
    files = files.concat(ns.ls("home", "/tools/"));
    files = files.concat(ns.ls("home", ".env.js"));
    files = files.concat(ns.ls("home", "/templates/"));

    for (const server of allServers) {
        ns.print(server);
        if (!server.hostname !== "home") {
            // clean up old files
            await ns.rm("/tools/", server.hostname);
            await ns.rm("/hacks/", server.hostname);
            await ns.rm(".env.js", server.hostname);
            await ns.rm("/stats/", server.hostname);

            // copy new files
            await ns.scp(files, "home", server.hostname);
            await ns.mv(server.hostname, "/templates/reserved.js", "/stats/reserved.js");
        };
    };
}

/** @param {import("../common").NS} ns */

export async function hack(ns) {
    const allServers = await qp.peekQueue(ns, env.serverListQueue);
    for (const server of allServers) {
        if (server.hostname != "home") {
            if (server.hasAdminRights) {

                ns.killall(server.hostname);
                await ns.sleep(100);

                ns.exec('hacks/node-hgw.js', server.hostname);
                await ns.sleep(100);
            };
        };
    };
}
