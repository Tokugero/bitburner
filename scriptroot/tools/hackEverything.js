import * as mapServers from './tools/mapServers';
import * as manageServer from './tools/manageServer';

/*

A daemon to continually attempt to take over any hackable node visible to the player.

*/

/** @param {import("../../common/.").NS} ns */

export async function main(ns){
    await gracefulHack(ns);
    ns.spawn("/tools/hackEverything.js");
}

/** @param {import("../../common/.").NS} ns */

export async function gracefulHack(ns){
    var allServers = await mapServers.getAllServers(ns);
    var mylevel = ns.getHackingLevel();

    for (const server of allServers){
        var isRoot = server.hasAdminRights;
        if (mylevel >= server.requiredHackingSkill && !isRoot) {

            if (!server.sshPortOpen && ns.fileExists("BruteSSH.exe", "home")) { ns.toast(`Bruteforcing ${server.hostname}: ${ns.brutessh(server.hostname)}`); };
            if (!server.ftpPortOpen && ns.fileExists("FTPCrack.exe", "home")) { ns.toast(`FTPCracking ${server.hostname}: ${ns.ftpcrack(server.hostname)}`) };
            if (!server.sqlPortOpen && ns.fileExists("SQLInject.exe", "home")) { ns.toast(`SQLInjecting ${server.hostname}: ${ns.sqlinject(server.hostname)}`) };
            if (!server.httpPortOpen && ns.fileExists("HTTPWORM.exe", "home")) { ns.toast(`HTTPWorming ${server.hostname}: ${ns.httpworm(server.hostname)}`) };
            if (!server.smtpPortOpen && ns.fileExists("relaySMTP.exe", "home")) { ns.toast(`relaySMTPing ${server.hostname}: ${ns.relaysmtp(server.hostname)}`) };

            
            while (!isRoot && server.openPortCount >= server.numOpenPortsRequired){
                ns.nuke(server.hostname);
                await ns.sleep(20);
                isRoot = ns.hasRootAccess(server.hostname);
                if (isRoot) {
                    if (server.moneyAvailable == 0){
                        var threads = manageServer.usableThreads(ns, server, "/hacks/node-hgw.js");
                        ns.exec('hacks/node-hgw.js', server.hostname, threads);
                    } else {
                        var threads = manageServer.usableThreads(ns, server, "/hacks/hgw.js");
                        ns.exec('hacks/hgw.js', server.hostname, threads, server.hostname);
                    };
                };
            };
        };
        await ns.sleep(20);
    };
}