import * as mapServers from '/tools/mapServers.js';

/** @param {import("../../common/.").NS} ns */

export async function main(ns){
    const args = ns.flags([["help", false]]);

    var freeSpace = 14;
    var localhost = ns.getServer();
    var threads = (localhost.maxRam-freeSpace)/Math.ceil(ns.getScriptRam("/tools/spreadLoad.js", localhost.hostname));

    var allServers = await mapServers.getAllServers(ns);
    while (true) {
        var worstServer = ns.getServer("joesguns");
        for (const server of allServers) {

            if ( server.hasAdminRights && worstServer.serverGrowth < server.serverGrowth) {
                worstServer = server;
            };
        };
        ns.exec("/hacks/hgw.js", localhost.hostname, threads, worstServer.hostname);
        await ns.sleep(100);
	};
}