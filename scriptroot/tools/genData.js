import * as mapServers from 'tools/mapServers.js';

/** @param {import("../common").NS} ns */

export async function main(ns){
    const args = ns.flags([
        ["help", false],
        ["connect", ""]
    ]);
    if (args.connect !== ""){
        ns.tprint(`\n${await connectionString(ns, args.connect)}`);
    } else if (args.help || !args._[0]){
        ns.tprint(`
        --connect <hostname>    \tGenerates connection string to hostname
        `);
    };
}

/** @param {import("../common").NS} ns */

export async function connectionString(ns, remote) { 

    let allServers = await mapServers.getAllServers(ns);
    var path = "Not found.";
    for (const server of allServers){
        if (server.hostname === remote){
            path = server.trail.join("; connect ")+"; connect "+server.hostname;
        }
    }
    return path;
}