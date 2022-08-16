import * as env from '.env.js';

/** @param {import("../../common").NS} ns */

export async function main(ns) {
    const args = ns.flags([]);

    let server = ns.getServer(args._[0]);
    let target = ns.getServer(args._[1]);
    let targets = args._[2];

    await loopController(ns, server, target, targets);
}

/** @param {import("../../common").NS} ns */
export async function loopController(ns, server, target, targets) {
    while (true) {
        let portionRam = Math.floor(server.maxRam / targets);
        await ns.wget(`${env.url}target=${target.hostname}&moneyMax=${target.moneyMax}&moneyAvailable=${target.moneyAvailable}&minDifficulty=${target.minDifficulty}&hackDifficulty=${target.hackDifficulty}`, `/dev/null.txt`);

        ns.print(`Starting new loop\n${"-".repeat(80)} \n\t$ = ${target.moneyAvailable}/${target.moneyMax} \n\tSecurity = ${target.minDifficulty}/${target.hackDifficulty}`);
        let freeThreads = Math.floor(portionRam / env.hgwMemoryBuffer);

        // Significantly drop security to get it ripe for pickin'
        if (target.hackDifficulty > (target.minDifficulty + env.securityBuffer)) {
            ns.exec("/hacks/weakenLoop.js", server.hostname, 1, server.hostname, target.hostname, freeThreads);
            await ns.sleep(ns.getWeakenTime(target.hostname));

            // Start massively increasing money available, run security weakeners in tandem
        } else if (target.moneyAvailable < target.moneyMax * env.moneyBuffer) {
            ns.exec("/hacks/growLoop.js", server.hostname, 1, server.hostname, target.hostname, freeThreads);
            await ns.sleep(ns.getGrowTime(target.hostname));

            // Do the hacking, run security weakeners in tandem
        } else {
            ns.exec("/hacks/hackLoop.js", server.hostname, 1, server.hostname, target.hostname, freeThreads);
            await ns.sleep(ns.getHackTime(target.hostname));
        };
        await ns.sleep(200);
    };
}
