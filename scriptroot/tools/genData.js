import * as mapServers from 'tools/mapServers.js';

/** @param {import("../common").NS} ns */

export async function connectionString(ns) { 
    let allServers = await mapServers.getAllServers(ns);
    var path = [];
    for (const server of allServers){
        ns.print(`\nServer: ${server.hostname}\nConnect Command:\n${server.trail.join("; connect ")}`);
        path.push({server: server, command: server.trail.join("; connect ")});
    }
    return path;
};