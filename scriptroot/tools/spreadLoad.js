/** @param {import("../../common/.").NS} ns */

export async function main(ns){
    var servers = ns.scan();
    var localhost = ns.getServer();

    for (const server of servers){
        if ( ns.getServer(server).hasAdminRights ) {
            ns.exec('hacks/hgw.js', localhost.hostname, localhost.cpuCores, server);
            await ns.sleep(100);
        };
    };
}