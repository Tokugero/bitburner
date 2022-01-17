import * as manageUpgrade from './tools/manageUpgrade.js';
import * as manageServer from './tools/manageServer.js';

/*

This function is responsible for upgrading the purchasable nodes. Mid to late runs
this will be the function that generates the majority of income.

*/

/** @param {import("../../common").NS} ns */

export async function main(ns){
    const args = ns.flags([]);
    await provision(ns, args._[0]);
}

/** @param {import("../../common").NS} ns */

export async function provision(ns, upgradeRam = 8) {
    /**
     * 8 = ~14m
     * 16 = ~21m
     * 128 = ~40m
     * 1024 = ~1.5b
     * 16384 = ~30b
     */
    var upgradeCost = ns.getPurchasedServerLimit() * ns.getPurchasedServerCost(upgradeRam);
    var files = ns.ls("home", "/hacks/");
    files = files.concat(ns.ls("home", "/tools/"));

    ns.exec("/tools/provisionFirstNodes.js", "home");

    if (upgradeCost < ns.getServerMoneyAvailable("home")) {
        var minRam = 9999999999999;
        for (const node of ns.getPurchasedServers()) {
            if (ns.getServer(node).maxRam < minRam) {
                minRam = ns.getServer(node).maxRam;
            };
        };
        if (minRam < upgradeRam) {
            await manageUpgrade.upgradeNodes(ns, files, upgradeRam);
        };
    } else {
        ns.tprint(`It will cost more than you have to upgrade your cluster. Cost = ${upgradeCost}`);
    };

    for (const server of ns.getPurchasedServers()) {
        await manageServer.copyAndHack(ns, ns.getServer(server), files);
    }
}
