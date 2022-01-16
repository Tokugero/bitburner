/** @param {import("../../common").NS} ns */

export async function copyAndHack(ns, server, files) {
    await ns.scp(files, "home", server.hostname);

    ns.exec("/hacks/node-hgw.js", server.hostname);
    await ns.sleep(20);
}

/** @param {import("../../common").NS} ns */

export function usableThreads(ns, server, script) {
    var maxram = server.maxRam-server.ramUsed;
    var scriptram = ns.getScriptRam(script, "home");
    var maxThreads = Math.floor(maxram/scriptram*.9); // 70% is a margin for processing
    if (maxThreads < 1 || !maxThreads) {
        var threads = 1;
    } else {
        var threads = maxThreads;
    };
    return threads;
}