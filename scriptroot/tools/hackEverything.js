import * as mapServers from './tools/mapServers';
import * as manageServer from './tools/manageServer';
import * as env from '.env.js';
import * as mqp from './tools/queuePorts.js';


/*

A daemon to continually attempt to take over any hackable node visible to the player.

*/

/** @param {import("../../common/.").NS} ns */

export async function main(ns) {
    await gracefulHack(ns);
    ns.spawn("/tools/hackEverything.js");
}

/** @param {import("../../common/.").NS} ns */

export async function gracefulHack(ns) {
    let allServers = await mqp.peekQueue(ns, env.serverListQueue);
    let mylevel = ns.getHackingLevel();

    for (const server of allServers) {
        let isRoot = server.hasAdminRights;
        if (mylevel >= server.requiredHackingSkill && !isRoot) {

            if (!server.sshPortOpen && ns.fileExists("BruteSSH.exe", "home")) { ns.toast(`Bruteforcing ${server.hostname}: ${ns.brutessh(server.hostname)}`); };
            if (!server.ftpPortOpen && ns.fileExists("FTPCrack.exe", "home")) { ns.toast(`FTPCracking ${server.hostname}: ${ns.ftpcrack(server.hostname)}`) };
            if (!server.sqlPortOpen && ns.fileExists("SQLInject.exe", "home")) { ns.toast(`SQLInjecting ${server.hostname}: ${ns.sqlinject(server.hostname)}`) };
            if (!server.httpPortOpen && ns.fileExists("HTTPWORM.exe", "home")) { ns.toast(`HTTPWorming ${server.hostname}: ${ns.httpworm(server.hostname)}`) };
            if (!server.smtpPortOpen && ns.fileExists("relaySMTP.exe", "home")) { ns.toast(`relaySMTPing ${server.hostname}: ${ns.relaysmtp(server.hostname)}`) };


            while (!isRoot && server.openPortCount >= server.numOpenPortsRequired) {
                ns.nuke(server.hostname);
                await ns.sleep(20);
                isRoot = ns.hasRootAccess(server.hostname);
                // Adding shim of 16 gig minimum ram to prevent servers from having to split their resources.
                if (server.maxRam >= env.hostMemoryFloor && isRoot) {
                    let threads = manageServer.usableThreads(ns, server, "hacks/node-hgw.js");
                    ns.exec('hacks/node-hgw.js', server.hostname, threads);
                };
            };
        };
        await ns.sleep(20);
    };
}