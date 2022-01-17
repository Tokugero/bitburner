import * as mapServers from './tools/mapServers.js';
import { url, secret } from '.env.js';

/*

This daemon is spawned on every node that isn't hacking itself. It should call a function
or check a control file to make a decision on where to hack/grow/weaken next and at what
depth.

*/

/** @param {import("../../common").NS} ns */

export async function main(ns) {
    while (true) {
        var worstServer = await rando(ns);
        await nodehgw(ns, ns.getServer(ns.getHostname()), worstServer);
    };
}

/** @param {import("../../common").NS} ns */

export async function nodehgw(ns, server, target) {
    let cont = true;
    const hgwRam = 2;

    while (cont) {
        target = ns.getServer(target.hostname);
        ns.print(`Starting new loop\n${"-".repeat(80)} \n\t$ = ${target.moneyAvailable}/${target.moneyMax} \n\tSecurity = ${target.minDifficulty}/${target.hackDifficulty}`);
        let freeThreads = Math.floor((server.maxRam - server.ramUsed) / hgwRam);
        if (server.hostname == "home") {
            if (server.maxRam < 32) {
                ns.tprint("You don't have a lot of ram, some of this may not work as expected. Upgrade to at least 32 asap!");
                freeThreads = Math.floor((server.maxRam - ramUsed) / hgwRam);
            }
            freeThreads = Math.floor((server.maxRam - 24) / hgwRam); // 2 = ram usage of hack/grow/weaken.js. 24 = headroom for this script + ctrl loop
        };

        // TODO: Centralize this decision to a single server rather than each node invoking it. 

        // Significantly drop security to get it ripe for pickin'
        if (target.hackDifficulty > (target.minDifficulty + 0.05) || server.maxRam < 16) {
            let minSleep = ns.getWeakenTime(target.hostname)
            ns.print(`${target.hostname} currently at ${target.hackDifficulty} difficulty (min is ${target.minDifficulty})`);
            ns.exec("hacks/weaken.js", server.hostname, freeThreads, target.hostname);
            await ns.wget(`${url}/?secret=${secret}&processes=1&hacking=0&growing=0&weakening=${freeThreads}`, `/dev/null.txt`);
            ns.print(`Max weaken sleeping for ${(minSleep / 1000 / 60)}`);
            await ns.sleep(minSleep + 10000);

        // Start massively increasing money available, run security weakeners in tandem
        } else if (target.moneyAvailable < target.moneyMax * 0.9 && server.maxRam > 16) {
            let growTime = ns.getGrowTime(target.hostname);
            let weakenTime = ns.getWeakenTime(target.hostname);
            let maxSleep = Math.max(growTime, weakenTime);
            let minSleep = Math.min(growTime, weakenTime);
            let effectThreads = Math.floor(freeThreads * .9);
            let weakenThreads = Math.ceil(freeThreads * .1);
            ns.print(`${target.hostname} currently at ${target.moneyAvailable} money (max is ${target.moneyMax})`);
            ns.exec("hacks/grow.js", server.hostname, effectThreads, target.hostname);
            await ns.wget(`${url}/?secret=${secret}&processes=1&hacking=0&growing=${effectThreads}&weakening=0`, `/dev/null.txt`);
            // Offset the script runtime so that weaken finishes immediately after
            await ns.sleep(maxSleep - minSleep + 1000);
            ns.exec("hacks/weaken.js", server.hostname, weakenThreads, target.hostname);
            await ns.wget(`${url}/?secret=${secret}&processes=1&hacking=0&growing=0&weakening=${weakenThreads}`, `/dev/null.txt`);
            ns.print(`Grow sleeping for ${(minSleep / 1000 / 60)}`);
            await ns.sleep(minSleep + 10000);

        // Do the hacking, run security weakeners in tandem
        } else if (server.maxRam > 16) {
            let hackTime = ns.getHackTime(target.hostname);
            let weakenTime = ns.getWeakenTime(target.hostname);
            let maxSleep = Math.max(hackTime, weakenTime);
            let minSleep = Math.min(hackTime, weakenTime);
            let effectThreads = Math.floor(freeThreads * .9);
            let weakenThreads = Math.ceil(freeThreads * .1);
            ns.exec("hacks/hack.js", server.hostname, effectThreads, target.hostname);
            await ns.wget(`${url}/?secret=${secret}&processes=1&hacking=${effectThreads}&growing=0&weakening=0`, `/dev/null.txt`);
            // Offset the script runtime so that weaken finishes immediately after
            await ns.sleep(maxSleep - minSleep + 1000);
            ns.exec("hacks/weaken.js", server.hostname, weakenThreads, target.hostname);
            await ns.wget(`${url}/?secret=${secret}&processes=1&hacking=0&growing=0&weakening=${weakenThreads}`, `/dev/null.txt`);
            ns.print(`Hack sleeping for ${(minSleep / 1000 / 60)}`);
            await ns.sleep(minSleep + 10000);

        } else {
            await ns.sleep(100); // to prevent too aggressive loops from small hosts.
        };
    };
}

/** @param {import("../../common").NS} ns */

async function rando(ns) {
    var allServers = await mapServers.getAllServers(ns);
    let mostMoney = ns.getServer("n00dles");
    for (const server of allServers) {
        if (!server.purchasedByPlayer && server.moneyAvailable > 0 && server.hasAdminRights && server.moneyMax > mostMoney.moneyMax) {
            mostMoney = server;
        }
    }

    return mostMoney;
}