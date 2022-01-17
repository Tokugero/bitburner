import * as mapServers from 'tools/mapServers.js';
import * as cloudcompute from 'automation/cloudcompute.js';

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
        ["search", ""],
        ["morenodes", 0]
    ]);
    if (args.tunnel !== "") {
        let fuzzy = await searchServers(ns, args.tunnel);
        if (fuzzy.length > 1){
            ns.tprint(`\nYour connection request was not specific enough.`);
            return;
        };
        ns.tprint(`\n${await connectionString(ns, fuzzy[0].hostname)}`);
    } else if (args.analyze) {
        ns.tprint(`\n${await ns.getServer(args.analyze)}`);
    } else if (args.search) {
        ns.tprint(`\n${JSON.stringify(await searchServers(ns, args.search), null, 2)}`);
    } else if (args.morenodes > 0) {
        let result = await cloudcompute.provision(ns, args.morenodes);
        ns.tprint(`\nAttempting to purchase nodes. Try scanning after a bit.`);
    } else if (args.help || !args._[0]) {
        ns.tprint(`
        --tunnel <hostname>    \tGenerates connection string to hostname
        --analyze <hostname>    \tDisplays detailed data about server
        --search <substring>    \tFind hosts that are beyond the analyze command
        --morenodes <int>      \tUpgrade purchased nodes to desired ram value
        `);
    };
}

/** @param {import("../common").NS} ns */

export async function connectionString(ns, remote) {

    let allServers = await mapServers.getAllServers(ns);
    var path = "Not found.";
    for (const server of allServers) {
        if (server.hostname === remote) {
            path = server.trail.join("; connect ") + "; connect " + server.hostname;
        }
    }
    return path;
}

export async function searchServers(ns, search) {
    let allServers = await mapServers.getAllServers(ns);
    let results = [];
    for (const server of allServers) {
        if (server.hostname.includes(search)) {
            results.push(server);
        }
    }
    return results;
}