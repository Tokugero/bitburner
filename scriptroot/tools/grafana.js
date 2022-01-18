import * as mapServers from 'tools/mapServers.js';
import { url } from '.env.js';

/*

Manage statistics that need to regularly be sent to grafana.

*/

/** @param {import("../../common").NS} ns */

export async function main(ns){
    let playerMoney = ns.getServerMoneyAvailable("home");
    await ns.wget(`${url}player=1&money=${playerMoney}`, `/dev/null.txt`);
    for (const serverDetails in await mapServers.getAllServers(ns)){
        await ns.wget(`${url}server=${serverDetails.hostname}&maxRam=${serverDetails.maxRam}&usedRam=${serverDetails.ramUsed}&cpu=${serverDetails.cpuCores}&moneyMax=${serverDetails.moneyMax}&moneyAvail=${serverDetails.moneyAvailable}&hacked=${(serverDetails.hasAdminRights ? 1 : 0)}&owned=${(serverDetails.purchasedByPlayer ? 1 : 0)}`, `/dev/null.txt`);
    };
    ns.spawn("tools/grafana.js");
};