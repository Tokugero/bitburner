import * as mapServers from './tools/mapServers.js';
import { url } from '.env.js';

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
        await ns.wget(`${url}target=${target.hostname}&moneyMax=${target.moneyMax}&moneyAvailable=${target.moneyAvailable}&minDifficulty=${target.minDifficulty}&hackDifficulty=${target.hackDifficulty}`, `/dev/null.txt`);

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

            ns.print(`${target.hostname} currently at ${target.hackDifficulty} difficulty (min is ${target.minDifficulty})\nEntering weaken loop.`);
            ns.exec("hacks/weaken.js", server.hostname, freeThreads, target.hostname);
            await ns.wget(`${url}hgw=weaken&weakening=${freeThreads}&server=${server.hostname}`, `/dev/null.txt`);
            ns.print(`Max weaken sleeping for ${(minSleep / 1000 / 60)}`);
            await ns.sleep(minSleep + 1000);

            await ns.wget(`${url}hgw=weaken&weakening=-${freeThreads}&server=${server.hostname}`, `/dev/null.txt`);

            // Start massively increasing money available, run security weakeners in tandem
        } else if (target.moneyAvailable < target.moneyMax * 0.9 && server.maxRam >= 16) {
            let growTime = ns.getGrowTime(target.hostname);
            let weakenTime = ns.getWeakenTime(target.hostname);
            let maxSleep = Math.max(growTime, weakenTime);
            let minSleep = Math.min(growTime, weakenTime);
            let effectThreads = Math.floor(freeThreads * .9);
            let weakenThreads = Math.ceil(freeThreads * .1);

            ns.print(`Entering Grow loop.`);
            ns.exec("hacks/weaken.js", server.hostname, weakenThreads, target.hostname);
            await ns.wget(`${url}hgw=weaken&weakening=${weakenThreads}&server=${server.hostname}`, `/dev/null.txt`);
            ns.print(`Grow sleeping for ${(maxSleep - minSleep / 1000 / 60)}`);
            await ns.sleep(maxSleep - minSleep);
            await ns.wget(`${url}hgw=weaken&weakening=-${weakenThreads}&server=${server.hostname}`, `/dev/null.txt`);

            ns.print(`${target.hostname} currently at ${target.moneyAvailable} money (max is ${target.moneyMax})`);
            ns.exec("hacks/grow.js", server.hostname, effectThreads, target.hostname);
            await ns.wget(`${url}hgw=grow&growing=${effectThreads}&server=${server.hostname}`, `/dev/null.txt`);
            // Offset the script runtime so that weaken finishes immediately after
            ns.print(`Grow sleeping for ${(minSleep / 1000 / 60)}`);
            await ns.sleep(minSleep + 10000);
            await ns.wget(`${url}hgw=grow&growing=-${effectThreads}&server=${server.hostname}`, `/dev/null.txt`);


            // Do the hacking, run security weakeners in tandem
        } else if (server.maxRam >= 16) {
            let hackTime = ns.getHackTime(target.hostname);
            let weakenTime = ns.getWeakenTime(target.hostname);
            let maxSleep = Math.max(hackTime, weakenTime);
            let minSleep = Math.min(hackTime, weakenTime);
            let effectThreads = Math.floor(freeThreads * .9);
            let weakenThreads = Math.ceil(freeThreads * .1);

            ns.print(`Entering Hack loop.`);
            ns.exec("hacks/weaken.js", server.hostname, weakenThreads, target.hostname);
            await ns.wget(`${url}hgw=weaken&weakening=${weakenThreads}&server=${server.hostname}`, `/dev/null.txt`);
            ns.print(`Hack sleeping for ${(maxSleep - minSleep / 1000 / 60)}`);
            await ns.sleep(maxSleep - minSleep);
            await ns.wget(`${url}hgw=weaken&weakening=-${weakenThreads}&server=${server.hostname}`, `/dev/null.txt`);

            ns.exec("hacks/hack.js", server.hostname, effectThreads, target.hostname);
            await ns.wget(`${url}hgw=hack&hacking=${effectThreads}&server=${server.hostname}`, `/dev/null.txt`);
            // Offset the script runtime so that weaken finishes immediately after
            ns.print(`Hack sleeping for ${(minSleep / 1000 / 60)}`);
            await ns.sleep(minSleep + 10000);
            await ns.wget(`${url}hgw=hack&hacking=-${effectThreads}&server=${server.hostname}`, `/dev/null.txt`);


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