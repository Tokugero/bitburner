import * as manageServer from './tools/manageServer.js';

/** @param {import("../../common/.").NS} ns */

export async function provision(ns) {
    var upgradeRam = 4096; // 8 is the starting value for this function.
    /**
     * 8 = ~14m
     * 16 = ~21m
     * 128 = ~40m
     * 1024 = ~1.5b
     */
    
    var upgradeCost = ns.getPurchasedServerLimit()*ns.getPurchasedServerCost(upgradeRam);
    var files = ns.ls("home", "/hacks/");
    files = files.concat(ns.ls("home", "/tools/"));

    ns.exec("/tools/provisionFirstNodes.js","home");
    
    if (upgradeCost < ns.getServerMoneyAvailable("home")){
        var minRam = 9999999999999;
        for (const node of ns.getPurchasedServers()){
            if (ns.getServer(node).maxRam < minRam){
                minRam = ns.getServer(node).maxRam;
            };
        };
        if (minRam < upgradeRam){
            await manageServer.upgradeNodes(ns, files, upgradeRam);
        };
    } else {
        ns.toast(`It will cost more than you have to upgrade your cluster. Cost = ${upgradeCost}`, "warning");
    };

    for (const server of ns.getPurchasedServers()) {
        await manageServer.copyAndHack(ns, ns.getServer(server), files);
    }
}
