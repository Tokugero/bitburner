import * as mapServers from './tools/mapServers';
import * as manageServer from './tools/manageServer';

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
        if (mylevel >= ns.getServerRequiredHackingLevel(server.hostname)) {
            if (!server.sshPortOpen && ns.fileExists("BruteSSH.exe", "home")) { ns.brutessh(server.hostname); };
            if (!server.ftpPortOpen && ns.fileExists("FTPCrack.exe", "home")) { ns.ftpcrack(server.hostname); };
            if (!server.sqlPortOpen && ns.fileExists("SQLInject.exe", "home")) { ns.sqlinject(server.hostname); };
            if (!server.httpPortOpen && ns.fileExists("HTTPWORM.exe", "home")) { ns.httpworm(server.hostname); };
            if (!server.smtpPortOpen && ns.fileExists("relaySMTP.exe", "home")) { ns.relaysmtp(server.hostname); };

            var isRoot = server.hasAdminRights;
            while (!isRoot && server.openPortCount > server.numOpenPortsRequired){
                ns.nuke(server.hostname);
                await ns.sleep(20);
                isRoot = ns.hasRootAccess(server.hostname);
                if (isRoot) {
                    var threads = manageServer.usableThreads(server);
                    ns.exec('hacks/hgw.js', server.hostname, threads, server.hostname);
                }
            };
        };
        await ns.sleep(20);
    };
}