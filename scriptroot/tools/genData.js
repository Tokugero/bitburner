import * as cloudcompute from 'automation/cloudcompute.js';
import * as qp from './tools/queuePorts.js';
import * as env from '.env.js';

/*

A helper script spawnable by the player. Try to exec() functions here rather than call them directly
to ensure the smallest footprint for interactive play.

*/

/** @param {import("../common").NS} ns */

export async function main(ns) {
    const args = ns.flags([
        ["help", false],
        ["tunnel", ""],
        ["analyze", ""],
        ["backdoors", false],
        ["search", ""],
        ["morenodes", 0]
    ]);
    if (args.tunnel !== "") {
        let fuzzy = await searchServers(ns, args.tunnel);
        if (fuzzy.length > 1) {
            ns.tprint(`\nYour connection request was not specific enough.`);
            return;
        };
        ns.tprint(`\n${await connectionString(ns, fuzzy[0].hostname)}`);
    } else if (args.analyze) {
        ns.tprint(`\n${await ns.getServer(args.analyze)}`);
    } else if (args.search) {
        ns.tprint(`\n${JSON.stringify(await searchServers(ns, args.search), null, 2)}`);
    } else if (args.backdoors) {
        const notables = ["CSEC", "I.I.I.I", "avmnite-02h", "run4theh111z", "The-Cave", "w0r1d_d43m0n"];
        for (const noteable of notables) {
            const detailedNoteable = ns.getServer(noteable);
            if (detailedNoteable.backdoorInstalled) {
                ns.tprint('\n' + noteable + ' is already backdoored!');
            } else if (detailedNoteable.openPortCount < detailedNoteable.numOpenPortsRequired) {
                ns.tprint('\n' + noteable + ' needs more hax');
            } else if (detailedNoteable.requiredHackingSkill > ns.getHackingLevel()) {
                ns.tprint('\n' + noteable + ' requires more hacking: ' + detailedNoteable.requiredHackingSkill);
            } else {
                ns.tprint('\n' + await connectionString(ns, noteable));
            }
        }
    } else if (args.morenodes > 0) {
        let result = await cloudcompute.provision(ns, args.morenodes);
        ns.tprint(`\nAttempting to purchase nodes. Try scanning after a bit.`);
    } else if (args.help || !args._[0]) {
        ns.tprint(`
        --backdoors            \tGet interesting servers that need to be backdoor
        --tunnel <hostname>    \tGenerates connection string to hostname
        --analyze <hostname>    \tDisplays detailed data about server
        --search <substring>    \tFind hosts that are beyond the analyze command
        --morenodes <int>      \tUpgrade purchased nodes to desired ram value
        `);
    };
}

/** @param {import("../common").NS} ns */

export async function connectionString(ns, remote) {

    let allServers = await qp.peekQueue(ns, env.serverListQueue);
    var path = "Not found.";
    for (const server of allServers) {
        if (server.hostname === remote) {
            path = server.trail.join("; connect ") + "; connect " + server.hostname;
        }
    }
    return path + "; backdoor";
}

export async function searchServers(ns, search) {
    let allServers = await qp.peekQueue(ns, env.serverListQueue);
    let results = [];
    for (const server of allServers) {
        if (server.hostname.toLowerCase().includes(search.toLowerCase())) {
            results.push(server);
        }
    }
    return results;
}