/** @param {import("../../common/.").NS} ns */

// Manage buy
// Manage upgrade
// Manage running hgw

export async function provision(ns) {
    var ram = 8;
    var i = ns.getPurchasedServers().length;
    var files = ns.ls("home", "/hacks/");
    files = files.concat(ns.ls("home", "/tools/"));

    // ns.tprint("Preparing to manage servers.");
    while (i < ns.getPurchasedServerLimit()){
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)){
            var hostname = ns.purchaseServer("node-"+i, ram);
            ns.tprintf("Purchased: %s", hostname);
            await copyAndHack(ns, hostname, files);
            ++i;
        } else {
            ns.toast("You broke af, you can't buy all the servers yet. Buy more later.", "error");
            break;
        }
    }

    for (const server of ns.getPurchasedServers()) {
        // ns.tprintf("Provisioning: %s", server)
        ns.killall(server);
        ns.print(files);
        await copyAndHack(ns, server, files);
    }
}

async function copyAndHack(ns, server, files) {
    await ns.scp(files, "home", server);

    var maxram = ns.getServerMaxRam(server)-ns.getServerUsedRam(server);
    var scriptram = 3; // ns.getScriptRam('/hacks/hgw.js', localhost);
    var maxThreads = Math.floor(maxram/scriptram*.9); // 70% is a margin for processing
    if (maxThreads < 1) {
        var threads = 1;
    } else {
        var threads = maxThreads;
    };
    ns.exec("/hacks/node-hgw.js", server, threads);
    await ns.sleep(100);
}
