/** @param {import("../../common").NS} ns */

export async function main(ns) {
    const args = ns.flags([["help", false]]);
    await virus(ns, args._[0]);
}

/** @param {import("../../common").NS} ns */

export async function virus(ns, parentServer) {
    var localhost = ns.getHostname();
    var servers = ns.scan();
    var files = ns.ls(localhost, "/hacks/");
    var mylevel = ns.getHackingLevel();

    for (const server of servers) {
        ns.tprintf("Server: %s from Localhosts: %s, %s", server, localhost, parentServer);

        if (server !== parentServer && server !== localhost) {
            var serverDetail = ns.getServer(server);
            ns.tprintf("%s is syncing...", serverDetail.hostname);
            await ns.scp(files, localhost, server);
            if (mylevel >= serverDetail.requiredHackingSkill) {
                ns.tprintf("%s is being infected...", serverDetail.hostname);
                await broadstroke(ns, serverDetail);
                if (serverDetail.hasAdminRights) {
                    ns.killall(server);
                    ns.exec('hacks/replicate.js', server, 1, localhost);
                    for (let ram = 0; ram < ns.getServerMaxRam(server);) {
                        ns.print(ram);
                        ram = ram + 3; //ns.getScriptRam('hacks/hgw.js', server);
                        ns.exec('hacks/hgw.js', server, serverDetail.cpuCores, server);
                        await ns.sleep(100);
                    };
                };
            };
        }
    }
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
