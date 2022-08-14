import { url, bigWeight } from '.env.js';

/** @param {import("../../common").NS} ns */

export async function main(ns) {
    const args = ns.flags([]);

    let server = ns.getServer(args._[0]);
    let target = ns.getServer(args._[1]);

    await loopController(ns, server, target);
}

/** @param {import("../../common").NS} ns */
export async function loopController(ns, server, target) {
    const hgwRam = hgwMemoryBuffer
    while (true) {
        target = ns.getServer(target.hostname);
        server.maxRam = Math.floor(server.maxRam / (server.maxRam / bigWeight)); // This is to get the amount of ram, divided by the split assumed by calling this script, and set it for the remainder
        await ns.wget(`${url}target=${target.hostname}&moneyMax=${target.moneyMax}&moneyAvailable=${target.moneyAvailable}&minDifficulty=${target.minDifficulty}&hackDifficulty=${target.hackDifficulty}`, `/dev/null.txt`);

        ns.print(`Starting new loop\n${"-".repeat(80)} \n\t$ = ${target.moneyAvailable}/${target.moneyMax} \n\tSecurity = ${target.minDifficulty}/${target.hackDifficulty}`);
        let freeThreads = Math.floor((server.maxRam) / hgwRam);

        // Significantly drop security to get it ripe for pickin'
        if (target.hackDifficulty > (target.minDifficulty + securityBuffer)) {
            ns.exec("/hacks/weakenLoop.js", server.hostname, 1, server.hostname, target.hostname, freeThreads);
            await ns.sleep(ns.getWeakenTime(target.hostname));

            // Start massively increasing money available, run security weakeners in tandem
        } else if (target.moneyAvailable < target.moneyMax * moneyBuffer) {
            ns.exec("/hacks/growLoop.js", server.hostname, 1, server.hostname, target.hostname, freeThreads);
            await ns.sleep(ns.getGrowTime(target.hostname));

            // Do the hacking, run security weakeners in tandem
        } else if (server.maxRam) {
            ns.exec("/hacks/hackLoop.js", server.hostname, 1, server.hostname, target.hostname, freeThreads);
            await ns.sleep(ns.getHackTime(target.hostname));

        };
        await ns.sleep(200);
    };
}
