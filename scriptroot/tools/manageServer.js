/** @param {import("../../common/.").NS} ns */

export function usableThreads(ns, server, script) {
    var maxram = server.maxRam-server.ramUsed;
    var scriptram = ns.getScriptRam(script, "home");
    var maxThreads = Math.floor(maxram/scriptram*.7); // 70% is a margin for processing
    if (maxThreads > 1) {
        var threads = maxThreads;
    } else {
        var threads = 1;
    };
    return threads;
}

/** @param {import("../../common/.").NS} ns */

export async function upgradeNodes(ns, files, ram) {
    var cloudNodes = ns.getPurchasedServers();
    for (const node of cloudNodes) {
        if (ns.getServerMaxRam(node) < ram){
            await upgradeNode(ns, ram, node, files);
            await ns.sleep(20);
        };
    };
}

/** @param {import("../../common/.").NS} ns */

export async function upgradeNode(ns, ram, server, files) {
    var cost = ns.getPurchasedServerCost(ram);
    var player = ns.getPlayer()
    while (ns.getServerMaxRam(server) < ram) {
        if (cost <= player.money) {
            ns.killall(server);
            await ns.sleep(20);
            ns.deleteServer(server);
            await ns.sleep(20);
            server = ns.purchaseServer(`${ram}-node`, ram);
            await ns.sleep(20);
            await copyAndHack(ns, server, files);
        } else {
            await ns.sleep(600000);
        };
    };
}

/** @param {import("../../common/.").NS} ns */

export async function copyAndHack(ns, server, files) {
    await ns.scp(files, "home", server);

    var maxram = ns.getServerMaxRam(server)-ns.getServerUsedRam(server);
    var scriptram = ns.getScriptRam('/hacks/node-hgw.js', "home");
    var maxThreads = Math.floor(maxram/scriptram*.9); // 70% is a margin for processing
    if (maxThreads < 1) {
        var threads = 1;
    } else {
        var threads = maxThreads;
    };
    ns.exec("/hacks/node-hgw.js", server, threads);
    await ns.sleep(100);
}
