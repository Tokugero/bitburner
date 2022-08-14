import * as manageUpgrade from './tools/manageUpgrade.js';
import * as manageServer from './tools/manageServer.js';

/*

This function is responsible for upgrading the purchasable nodes. Mid to late runs
this will be the function that generates the majority of income.

*/

/** @param {import("../../common").NS} ns */

export async function main(ns) {
    const args = ns.flags([]);
    await maxProvision(ns);
    ns.spawn("/tools/provision.js", 1);
}

/** @param {import("../../common").NS} ns */

export async function provision(ns, upgradeRam = 16) {
    const upgradeCost = ns.getPurchasedServerLimit() * ns.getPurchasedServerCost(upgradeRam);
    let files = ns.ls("home", "/hacks/");
    files = files.concat(ns.ls("home", "/tools/"));
    files = files.concat(ns.ls("home", ".env.js"));

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
    };

    for (const server of ns.getPurchasedServers()) {
        await manageServer.copyAndHack(ns, ns.getServer(server), files);
    };
}

export async function maxProvision(ns) {
    let maxRam = 16;
    const serverLimit = ns.getPurchasedServerLimit();
    const availableFunds = ns.getServerMoneyAvailable("home");
    let keepLooking = true;

    while (keepLooking) {
        let upgradeCost = serverLimit * ns.getPurchasedServerCost(maxRam);
        maxRam = maxRam * 2;
        if (upgradeCost > availableFunds) {
            keepLooking = false;
        }
    }

    await provision(ns, maxRam);
}