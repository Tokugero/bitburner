/** @param {import("../../common/.").NS} ns */

// Manage hacknet servers ns.hacknet.*
// https://github.com/danielyxie/bitburner/blob/dev/markdown/bitburner.hacknet.md

export async function main(ns){ 
    await upgradeLoop(ns);
    ns.spawn("/tools/manageHacknet.js", 1, "home");
 };

 /** @param {import("../../common/.").NS} ns */


export async function upgradeLoop(ns){
    var threshold = .7; //70% of total money available ever. Eventually this will leave enough buffer for other game items?
    var maxSpend = ns.getServerMoneyAvailable("home")*threshold;
    var spent = 0;
    while(spent <= maxSpend){
        var cheapestRam = "unset";
        var cheapestCPU = "unset"
        var cheapestLevel = "unset";
        var cheapestServer = false;

        if (ns.hacknet.numNodes() == 0){
            spent += ns.hacknet.getPurchaseNodeCost();
            ns.hacknet.purchaseNode();
        };
        ns.print(ns.hacknet.numNodes());
        for (let i = 0; i < ns.hacknet.numNodes(); i++){
            if (cheapestRam == "unset" || ns.hacknet.getRamUpgradeCost(i, 1) < cheapestRam["cost"]){
                cheapestRam = {
                    "node": i,
                    "cost": ns.hacknet.getRamUpgradeCost(i, 1)
                };
            };
            if (cheapestCPU == "unset" || ns.hacknet.getCoreUpgradeCost(i, 1) < cheapestCPU["cost"]){
                cheapestCPU = {
                    "node": i,
                    "cost": ns.hacknet.getCoreUpgradeCost(i, 1)
                };
            };
            if (cheapestLevel == "unset" || ns.hacknet.getLevelUpgradeCost(i, 1) < cheapestLevel["cost"]){
                cheapestLevel = {
                    "node": i,
                    "cost": ns.hacknet.getLevelUpgradeCost(i, 1)
                };
            };                        
        };
        if (ns.hacknet.numNodes() < ns.hacknet.maxNumNodes()) {
            cheapestServer = ns.hacknet.getPurchaseNodeCost();
        };
        ns.print(`${cheapestCPU["cost"]}, ${cheapestLevel["cost"]}, ${cheapestServer}, ${cheapestRam["cost"]}, ${Math.min(cheapestCPU["cost"], cheapestLevel["cost"], cheapestServer["cost"])}`);
        if (cheapestRam["cost"] < Math.min(cheapestCPU["cost"], cheapestLevel["cost"], cheapestServer) && (cheapestRam["cost"]+spent) < maxSpend){
            spent += ns.hacknet.getRamUpgradeCost(cheapestRam["node"], 1);
            ns.hacknet.upgradeRam(cheapestRam["node"], 1);
        } else if (cheapestCPU["cost"] < Math.min(cheapestRam["cost"], cheapestLevel["cost"], cheapestServer) && (cheapestCPU["cost"]+spent) < maxSpend){
            spent += ns.hacknet.getCoreUpgradeCost(cheapestRam["node"], 1);
            ns.hacknet.upgradeCore(cheapestCPU["node"], 1);
        } else if (cheapestLevel["cost"] < Math.min(cheapestRam["cost"], cheapestServer, cheapestCPU["cost"]) && (cheapestLevel["cost"]+spent) < maxSpend){
            spent += ns.hacknet.getLevelUpgradeCost(cheapestRam["node"], 1);
            ns.hacknet.upgradeLevel(cheapestLevel["node"], 1);
        } else if (!cheapestServer == false && (cheapestServer+spent) < maxSpend){
            spent += cheapestServer;
            ns.hacknet.purchaseNode();
        } else {
            break;
        };
    };
};