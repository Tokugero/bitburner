import * as mapServers from './tools/mapServers';

/** @param {import("../common").NS} ns */

export async function main(ns) {
    await replicate(ns);
    await hack(ns);
}

/** @param {import("../common").NS} ns */

export async function replicate(ns) {
    var servers = await mapServers.getAllServers(ns);
    var files = ns.ls("home","/hacks/");
    for (const server of servers) {
        if (server.hostname.indexOf("node-") == -1 ) {
            await ns.scp(files, "home", server.hostname);
        };
    };
}

/** @param {import("../common").NS} ns */

export async function hack(ns) {
    var servers = await mapServers.getAllServers(ns);
    for (const server of servers) {
        if (server.hostname.indexOf("node-") == -1 ) {
            ns.tprintf("%s: %s", server.hostname, server.hasAdminRights);
            if (server.hasAdminRights) {
                var maxram = server.maxRam-server.ramUsed;
                var scriptram = 3; // ns.getScriptRam('/hacks/hgw.js', localhost);
                var maxThreads = Math.floor(maxram/scriptram*.9); // 70% is a margin for processing
                if (maxThreads < 1) {
                    var threads = 1;
                } else {
                    var threads = maxThreads;
                };
                ns.killall(server.hostname);
                await ns.sleep(100);
                ns.exec('hacks/hgw.js', server.hostname, threads, server.hostname);
                await ns.sleep(100);
            };
        };
    };
}
