import * as manageServer from './tools/manageServer.js';
import { url } from '.env.js';

/*

This is a quick & dirty method to create the first set of servers in a daemon loop until
at least this small node group exists to start gathering exp & money.

*/

// TODO: Cover this functionality within the provision.js logic and remove this function entirely.

/** @param {import("../../common").NS} ns */

export async function main(ns) {
    var files = ns.ls("home", "/hacks/");
    files = files.concat(ns.ls("home", "/tools/"));
    files = files.concat(ns.ls("home", ".env.js"));

    var ram = 16; // arbitrary starting value, keep it low to start services cheap. Anything lower than 16 isn't worth it right now
    var i = ns.getPurchasedServers().length || 0;

    // Initialize first server purchase
    while (i < ns.getPurchasedServerLimit()) {
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
            var hostname = ns.purchaseServer(`${ram}-node`, ram);
            await ns.wget(`${url}boughtserver=add&server=${hostname}&ram=${ram}`, `/dev/null.txt`);
            await manageServer.copyAndHack(ns, ns.getServer(hostname), files);
            i++;
        } else {
            ns.spawn("/tools/provisionFirstNodes.js");
        };
    };
}