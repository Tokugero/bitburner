/** @param {import("../../common").NS} ns */

export async function main(ns) {
	const args = ns.flags([["help", false]]);
	var server = args._[0];

    var mylevel = ns.getHackingLevel();

    if (mylevel >= ns.getServerRequiredHackingLevel(server)) {
        if (!server.sshPortOpen && ns.fileExists("BruteSSH.exe", "home")) { ns.brutessh(server); };
        if (!server.ftpPortOpen && ns.fileExists("FTPCrack.exe", "home")) { ns.ftpcrack(server); };
        if (!server.sqlPortOpen && ns.fileExists("SQLInject.exe", "home")) { ns.sqlinject(server); };
        if (!server.httpPortOpen && ns.fileExists("HTTPWORM.exe", "home")) { ns.httpworm(server); };
        if (!server.smtpPortOpen && ns.fileExists("relaySMTP.exe", "home")) { ns.relaysmtp(server); };

        // Add more injects as available
        var isRoot = ns.hasRootAccess(server)
        for (let i = 0; i < 10; i++) {
            if (!isRoot) {
                ns.nuke(server);
                await ns.sleep(100);
                isRoot = ns.hasRootAccess(server);
            } else {
                break;
            };
        };
    };
    await ns.sleep(100);
}
