import * as manageUpgrade from './tools/manageUpgrade.js';
import * as manageServer from './tools/manageServer.js';

/*

This function is responsible for upgrading the purchasable nodes. Mid to late runs
this will be the function that generates the majority of income.

*/

/** @param {import("../../common").NS} ns */

export async function main(ns) {
    await maxProvision(ns);
    ns.spawn("tools/provision.js", 1);
}

/** @param {import("../../common").NS} ns */

export async function provision(ns, upgradeRam = 16) {
    const upgradeCost = ns.getPurchasedServerLimit() * ns.getPurchasedServerCost(upgradeRam);
    let files = ns.ls("home", "/hacks/");
    files = files.concat(ns.ls("home", "/tools/"));
    files = files.concat(ns.ls("home", ".env.js"));

    if (upgradeCost < ns.getServerMoneyAvailable("home")) {
        let minRam = 9999999999999;
        for (const node of ns.getPurchasedServers()) {
            if (ns.getServer(node).maxRam < minRam) {
                minRam = ns.getServer(node).maxRam;
            };
        };
        if (minRam < upgradeRam) {
            ns.toast("Upgrading nodes to " + upgradeRam + "GB ram.", "success");
            await manageUpgrade.upgradeNodes(ns, files, upgradeRam);
        };
        if (ns.getPurchasedServers().length <= ns.getPurchasedServerLimit()) {
            ns.toast("Below limit, purchasing first servers.", "success");
            while (ns.getPurchasedServers().length < ns.getPurchasedServerLimit()) {
                await manageUpgrade.purchaseServer(ns, upgradeRam, files);
            }
        }
    } else {
        ns.toast("Not enough money " + upgradeCost + " to upgrade to " + upgradeRam + " nodes.", "warning");
    };

    for (const server of ns.getPurchasedServers()) {
        await manageServer.copyAndHack(ns, ns.getServer(server), files);
    };
}

export async function maxProvision(ns) {
    ns.print("Checking for max provision.");
    let maxRam = 16;
    const serverLimit = ns.getPurchasedServerLimit();
    const availableFunds = ns.getServerMoneyAvailable("home");
    let upgradeCost = serverLimit * ns.getPurchasedServerCost(maxRam);
    let lastGoodRam = maxRam;
    const purchasedServers = ns.getPurchasedServers();
    if (purchasedServers.length < serverLimit) {
        ns.toast("Not enough purchased servers, purchasing first servers.", "warning");
        await provision(ns);
        return;
    }

    while (true) {
        if (upgradeCost < availableFunds) {
            lastGoodRam = maxRam;
            maxRam = maxRam * 2;
            upgradeCost = serverLimit * ns.getPurchasedServerCost(maxRam);
        } else if (upgradeCost >= availableFunds) {
            ns.print("Not enough money " + upgradeCost + " to upgrade to " + maxRam + " nodes. Breaking max provision.");
            break;
        } else {
            break;
        }
    }

    const sampleServer = ns.getServer(purchasedServers[0]);
    if (sampleServer.maxRam < lastGoodRam) {
        ns.print("Upgrading nodes to " + lastGoodRam + "GB ram.");
        await provision(ns, lastGoodRam);
        return;
    }
}