import * as mapServers from './tools/mapServers.js';
import * as manageServer from './tools/manageServer.js';

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
    var allServers = await mapServers.getAllServers(ns);
    var files = ns.ls("home", "/hacks/");
    files = files.concat(ns.ls("home", "/tools/"));
    files = files.concat(ns.ls("home", ".env.js"));

    for (const server of allServers) {
        ns.print(server);
        if (!server.hostname !== "home") {
            await ns.scp(files, "home", server.hostname);
        };
    };
}

/** @param {import("../common").NS} ns */

export async function hack(ns) {
    var allServers = await mapServers.getAllServers(ns);
    for (const server of allServers) {
        // Adding shim of 16 gig minimum ram to prevent servers from having to split their resources.
        if (server.hostname !== "home") {
            if (server.hasAdminRights) {
                ns.killall(server.hostname);
                await ns.sleep(100);

                ns.exec('hacks/node-hgw.js', server.hostname);
                //if (server.maxRam > 16){
                //    ns.exec('hacks/share.js', server.hostname);
                //};
                await ns.sleep(100);
            };
        };
    };
}
