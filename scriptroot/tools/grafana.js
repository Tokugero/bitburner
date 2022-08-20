import * as env from '.env.js';
import * as qp from 'tools/queuePorts.js';
import * as mg from 'tools/manageGrafana.js';
/*

Manage statistics that need to regularly be sent to grafana.

*/

/** @param {import("../../common").NS} ns */

export async function main(ns) {
    let playerMoney = ns.getServerMoneyAvailable("home");
    await mg.submitMetrics(ns, "player", "1", [{ "name": "money", "value": playerMoney }]);
    for (const serverDetails of await qp.peekQueue(ns, env.serverListQueue)) {
        await mg.submitMetrics(ns, "server", serverDetails.hostname,
            [
                { "name": "maxRam", "value": serverDetails.maxRam },
                { "name": "moneyusedRamMax", "value": serverDetails.ramUsed },
                { "name": "cpu", "value": serverDetails.cpuCores },
                { "name": "moneyMax", "value": serverDetails.moneyMax },
                { "name": "moneyAvail", "value": serverDetails.moneyAvailable },
                { "name": "hacked", "value": (serverDetails.hasAdminRights ? 1 : 0) },
                { "name": "owned", "value": (serverDetails.purchasedByPlayer ? 1 : 0) }
            ]);
    };
    ns.spawn("tools/grafana.js");
};


// other things to get with queue env.monitoringQueue

// server specific stats (already doing this)
// player specific stats
// query nodes in hackingQueues
// Sleeve status
// update hacking specific data
// Hacknet status?

// format queue and dump into influx