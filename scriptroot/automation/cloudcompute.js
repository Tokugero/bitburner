/** @param {import("../../common/.").NS} ns */

// Manage buy
// Manage upgrade
// Manage running hgw

export async function main(ns) {
    var ram = 8;
    var i = ns.getPurchasedServers().length;
    var files = ns.ls("home", "/hacks/");

    while (i < ns.getPurchasedServerLimit()){
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)){
            var hostname = ns.purchaseServer("node-"+i, ram);
            ns.tprintf("Purchased: %s", hostname);
            await copyAndHack(ns, hostname, files);
            ++i;
        }
    }

    for (const server of ns.getPurchasedServers()) {
        ns.tprintf("Provisioning: %s", server)
        ns.killall(server);
        await copyAndHack(ns, server, files);
    }
}

async function copyAndHack(ns, server, files) {
    await ns.scp(files, "home", server);
    ns.exec("hacks/hgw.js", server, 3, "omega-net");
    await ns.sleep(100);
}