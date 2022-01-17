import { url, secret } from '.env.js';

/*

Manage statistics that need to regularly be sent to grafana.

*/

/** @param {import("../../common").NS} ns */

export async function main(ns){
    let playerMoney = ns.getServerMoneyAvailable("home");
    await ns.wget(`${url}/money?secret=${secret}&money=${playerMoney}`, `/dev/null.txt`);
    ns.spawn("tools/grafana.js");
};