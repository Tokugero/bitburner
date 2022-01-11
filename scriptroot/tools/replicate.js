import * as mapServers from './tools/mapServers.js';
import * as manageServer from './tools/manageServer.js';

/** @param {import("../common").NS} ns */

export async function main(ns) {
    await replicate(ns);
    await hack(ns);
}

/** @param {import("../common").NS} ns */

export async function replicate(ns) {
    var servers = await mapServers.getAllServers(ns);
    var files = ns.ls("home","/hacks/");
    files = files.concat(ns.ls("home","/tools/"));
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
            if (server.hasAdminRights) {
                
                ns.killall(server.hostname);
                await ns.sleep(100);
                if (server.moneyAvailable == 0){
                    var threads = manageServer.usableThreads(ns, server, '/hacks/node-hgw.js');
                    ns.exec('hacks/node-hgw.js', server.hostname, threads);
                } else {
                    var threads = manageServer.usableThreads(ns, server, '/hacks/hgw.js');
                    ns.exec('hacks/hgw.js', server.hostname, threads, server.hostname);
                };
                await ns.sleep(100);
            };
        };
    };
}
