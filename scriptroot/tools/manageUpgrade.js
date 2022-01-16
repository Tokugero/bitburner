/** @param {import("../../common").NS} ns */

export async function upgradeNodes(ns, files, ram) {
    var cloudNodes = ns.getPurchasedServers();
    for (const node of cloudNodes) {
        if (ns.getServerMaxRam(node) < ram){
            await upgradeNode(ns, ram, node, files);
            await ns.sleep(20);
        };
    };
}

/** @param {import("../../common").NS} ns */

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
            await copyAndHack(ns, ns.getServer(server), files);
        } else {
            await ns.sleep(600000);
        };
    };
}

