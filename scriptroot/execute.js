import * as cloudcompute from 'automation/cloudcompute.js';
import * as distribute from 'automation/distribute.js';
import * as hacknetManager from 'automation/hacknet.js';


/** @param {import("../common").NS} ns */

export async function main(ns) { 
    //start distribute
    await distribute.replicate(ns);
    ns.tprint("Initializing File Replicators.");
    await ns.sleep(100); // Try to make all scripts start at different times
    await distribute.root(ns);
    ns.tprint("Initializing RCEs.");
    await ns.sleep(100);

    //start file discovery
    await distribute.finderKeeper(ns);
    ns.tprint("Initializing file scrapers.");
    await ns.sleep(100);

    //start cloudcompute
    await cloudcompute.provision(ns, 8);
    ns.tprint("Purchasing first servers.");
    await ns.sleep(3000); // This takes a little longer to run

    //start hacknet
    await hacknetManager.startBuying(ns);
    ns.tprint("Initializing hacknet manager.");
    await ns.sleep(100);

    ns.tprint(`
    Helpful alias commands:
    \talias init="run execute.js" --tail
    \talias get="run tools/genData.js"
    \talias hackabit="run hacks/node-hgw.js" \t#REMEMBER TO CALC THREADS FOR THIS
    ${"-".repeat(80)}
    `);
}
