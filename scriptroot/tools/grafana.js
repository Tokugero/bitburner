import * as env from '.env.js';
import * as qp from 'tools/queuePorts.js';
import * as mg from 'tools/manageGrafana.js';
/*

Manage statistics that need to regularly be sent to grafana.

*/

/** @param {import("../../common").NS} ns */

export async function main(ns) {
    const player = ns.getPlayer();
    const home = ns.getServer("home");

    // collect metrics for player
    await mg.submitMetrics(ns, "player", "1",
        [
            { "name": "money", "value": player.money },
            { "name": "entropy", "value": player.entropy },
            { "name": "hacking", "value": player.hacking },
            { "name": "str", "value": player.strength },
            { "name": "dex", "value": player.dexterity },
            { "name": "def", "value": player.defense },
            { "name": "agi", "value": player.agility },
            { "name": "cha", "value": player.charisma },
            { "name": "int", "value": player.intelligence },
            { "name": "location", "value": player.location },
            { "name": "totalPlaytime", "value": player.totalPlaytime }
        ]);

    // collect metrics for all servers other than home
    for (const serverDetails of await qp.peekQueue(ns, env.serverListQueue)) {
        await mg.submitMetrics(ns, "serverDetail", serverDetails.hostname,
            [
                { "name": "maxRam", "value": serverDetails.maxRam },
                { "name": "ramUsed", "value": serverDetails.ramUsed },
                { "name": "ramFree", "value": serverDetails.maxRam - serverDetails.ramUsed },
                { "name": "cpu", "value": serverDetails.cpuCores },
                { "name": "portsRequiured", "value": serverDetails.portsRequiured },
                { "name": "moneyMax", "value": serverDetails.moneyMax },
                { "name": "moneyAvail", "value": serverDetails.moneyAvailable },
                { "name": "hacked", "value": (serverDetails.hasAdminRights ? 1 : 0) },
                { "name": "owned", "value": (serverDetails.purchasedByPlayer ? 1 : 0) }
            ]);
    };

    // collect metrics for home server
    await mg.submitMetrics(ns, "serverDetail", home.hostname,
        [
            { "name": "maxRam", "value": home.maxRam },
            { "name": "ramUsed", "value": home.ramUsed },
            { "name": "ramFree", "value": home.maxRam - home.ramUsed },
            { "name": "cpu", "value": home.cpuCores },
            { "name": "moneyMax", "value": home.moneyMax },
            { "name": "moneyAvail", "value": home.moneyAvailable },
            { "name": "hacked", "value": (home.hasAdminRights ? 1 : 0) },
            { "name": "owned", "value": (home.purchasedByPlayer ? 1 : 0) },
            { "name": "home", "value": 1 }
        ]);
    await ns.spawn("tools/grafana.js");
};


// other things to get with queue env.monitoringQueue

// server specific stats (already doing this)
// player specific stats
// query nodes in hackingQueues
// Sleeve status
// update hacking specific data
// Hacknet status?

// format queue and dump into influx