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
    var files = ["/hacks/hgw.js", "/hacks/replicate.js", "/hacks/bruteforce.js"];

    // ns.print(servers);
    for (const server of servers) {
        if (server !== parentServer && server !== localhost && server.indexOf("node-") == -1 ) {
            ns.sprintf("Working on %s from %s with parent %s...", server, localhost, parentServer);

            // ns.printf("%s is syncing...", serverDetail.hostname);
            await ns.scp(files, localhost, server);
            
            // ns.printf("%s is being infected...", serverDetail.hostname);


            if (ns.hasRootAccess(localhost)) {
                var maxram = ns.getServerMaxRam(server)-ns.getServerUsedRam(server);
                var scriptram = 3; // ns.getScriptRam('/hacks/hgw.js', localhost);
                var maxThreads = Math.floor(maxram/scriptram*.9); // 70% is a margin for processing
                if (maxThreads < 1) {
                    var threads = 1;
                } else {
                    var threads = maxThreads;
                };
                if (!ns.hasRootAccess(server)){
                    ns.exec('hacks/bruteforce.js', localhost, 1, server);
                }
                await ns.sleep(100);
                ns.exec('hacks/replicate.js', server, 1, localhost);
                await ns.sleep(100);
                ns.exec('hacks/hgw.js', server, threads, server);
                await ns.sleep(100);
            };
        };
    };
}
