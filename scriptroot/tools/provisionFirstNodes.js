import * as manageServer from './tools/manageServer.js';

/** @param {import("../../common").NS} ns */

export async function main(ns){
    var files = ns.ls("home", "/hacks/");
    files = files.concat(ns.ls("home", "/tools/"));
    var ram = 8; // arbitrary starting value, keep it low to start services cheap
    var i = ns.getPurchasedServers().length || 0;

    // Initialize first server purchase
    while (i < ns.getPurchasedServerLimit()){
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)){
            var hostname = ns.purchaseServer(`${ram}-node`, ram);
            await manageServer.copyAndHack(ns, hostname, files);
            i++;
        } else {
            ns.spawn("/tools/provisionFirstNodes.js");
        };
    }; 
}