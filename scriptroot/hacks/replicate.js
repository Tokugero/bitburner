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
        
        if ( server !== parentServer && server !== localhost ) {
            var serverDetail = ns.getServer(server);
            ns.tprintf("%s is syncing...", serverDetail.hostname);
            await ns.scp(files, localhost, server);
            if ( mylevel >= serverDetail.requiredHackingSkill) { 
                ns.tprintf("%s is being infected...", serverDetail.hostname);
                await broadstroke(ns, serverDetail); 
                if (serverDetail.hasAdminRights) {ns.exec('hacks/replicate.js', server, 1, localhost);};
            };
        }
    }
}

/** @param {import("../../common").NS} ns */

async function broadstroke(ns, server) {
    if (!server.sshPortOpen) { ns.brutessh(server.hostname); };
    if (!server.ftpPortOpen) { ns.ftpcrack(server.hostname); };
    // Add more injects as available
    
    if (!server.hasAdminRights && server.numOpenPortsRequired <= server.openPortCount) { ns.nuke(server.hostname); };
    
    await ns.sleep(100);
}
