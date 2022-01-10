/** @param {import("../../common").NS} ns */

export async function main(ns) {
    const args = ns.flags([["help", false]]);
    await virus(ns, args._[0]);
}

/** @param {import("../../common").NS} ns */
// TODO: Split this into a dedicated replicate function & hgw start function to minimize ram usage.
export async function virus(ns, parentServer) {
    var localhost = ns.getHostname();
    var servers = ns.scan();
    var files = ns.ls(localhost, "/hacks/");
    var mylevel = ns.getHackingLevel();

    // ns.print(servers);
    for (const server of servers) {
        if (server !== parentServer && server !== localhost && server.indexOf("node-") == -1 ) {
            // ns.printf("Working on %s from %s with parent %s...", server, localhost, parentServer);
            var serverDetail = ns.getServer(server);

            if (mylevel >= serverDetail.requiredHackingSkill) {
                // ns.printf("%s is syncing...", serverDetail.hostname);
                await ns.scp(files, localhost, server);
                
                // ns.printf("%s is being infected...", serverDetail.hostname);
                await broadstroke(ns, serverDetail);
                if (serverDetail.hasAdminRights) {
                    var maxram = serverDetail.maxRam;
                    var scriptram = ns.getScriptRam('/hacks/hgw.js', server);
                    var threads = Math.floor(maxram/scriptram*.7); // 70% is a margin for processing

                    ns.killall(server);
                    await ns.sleep(250);
                    ns.exec('hacks/replicate.js', server, 1, localhost);
                    await ns.sleep(100);
                    ns.exec('hacks/hgw.js', server, threads, server);
                    await ns.sleep(100);
                };
            };
        };
    };
}

/** @param {import("../../common").NS} ns */

async function broadstroke(ns, server) {
    if (!server.sshPortOpen && ns.fileExists("BruteSSH.exe", "home")) { ns.brutessh(server.hostname); };
    if (!server.ftpPortOpen && ns.fileExists("FTPCrack.exe", "home")) { ns.ftpcrack(server.hostname); };
    if (!server.sqlPortOpen && ns.fileExists("SQLInject.exe", "home")) { ns.sqlinject(server.hostname); };
    if (!server.httpPortOpen && ns.fileExists("HTTPWORM.exe", "home")) { ns.httpworm(server.hostname); };
    if (!server.smtpPortOpen && ns.fileExists("relaySMTP.exe", "home")) { ns.relaysmtp(server.hostname); };

    // Add more injects as available

    if (server.numOpenPortsRequired <= server.openPortCount) {
        var isRoot = ns.hasRootAccess(server.hostname);
        while (!isRoot) {
            ns.nuke(server.hostname);
            await ns.sleep(100);
            isRoot = ns.hasRootAccess(server.hostname);
        };
    };

    await ns.sleep(100);
}
