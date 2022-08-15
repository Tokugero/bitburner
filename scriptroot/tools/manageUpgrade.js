import * as manageServer from './tools/manageServer.js';

/*

This is a group of expensive functions that only need to be called when required. 

*/

// TODO: make a main and execute this logic as "exec" rather than calling these directly to save on 
//       ram usage of the daemon calling these.

/** @param {import("../../common").NS} ns */

export async function upgradeNodes(ns, files, ram) {
    var cloudNodes = ns.getPurchasedServers();
    for (const node of cloudNodes) {
        if (ns.getServerMaxRam(node) < ram) {
            await upgradeNode(ns, ram, node, files);
            await ns.sleep(1000);
        };
    };
}

/** @param {import("../../common").NS} ns */

export async function upgradeNode(ns, ram, server, files) {
    var cost = ns.getPurchasedServerCost(ram);
    var player = ns.getPlayer()
    if (ns.getServerMaxRam(server) < ram) {
        if (cost <= player.money) {
            ns.killall(server);
            await ns.sleep(1000);
            ns.deleteServer(server);
            await ns.sleep(1000);
            await purchaseServer(ns, ram, files)
        } else {
            await ns.sleep(600000);
        };
    };
}

/** @param {import("../../common").NS} ns */

export async function purchaseServer(ns, ram, files) {
    ns.print("Purchasing new server")
    let server = ns.purchaseServer(`${ram}-node`, ram);
    await ns.sleep(100);
    await manageServer.copyAndHack(ns, ns.getServer(server), files);
}