/** @param {import("../../common/.").NS} ns */
import * as mapServers from 'mapServers.js';

export async function main(ns){
    const args = ns.flags([["help", false]]);

    var allServers = mapServers.getAll();

    var freeSpace = 14;
    var localhost = ns.getServer();
    var threads = (localhost.maxRam-freeSpace)/Math.ceil(ns.getScriptRam("/hacks/hgw.js", localhost.hostname));
    var endpoint = args._[0];
    while(true){
        ns.exec('hacks/hgw.js', localhost.hostname, threads, endpoint);
        await ns.sleep(100);
    };
}