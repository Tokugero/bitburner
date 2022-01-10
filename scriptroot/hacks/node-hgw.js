import * as mapServers from './tools/mapServers.js';
import * as hgw from './hacks/hgw.js';

/** @param {import("../../common").NS} ns */

export async function main(ns) {
    var allServers = await mapServers.getAllServers(ns);
    while (true) {
        var worstServer = ns.getServer("joesguns");
        for (const server of allServers) {

            if ( server.hasAdminRights && worstServer.serverGrowth < server.serverGrowth) {
                worstServer = server;
            };
        };
        await hgw.hgw(ns, worstServer.hostname);
	};
}
