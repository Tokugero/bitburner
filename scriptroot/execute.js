import * as cloudcompute from 'automation/cloudcompute.js';
import * as distribute from 'automation/distribute.js';
import * as hacknetManager from 'automation/hacknet.js';
import * as stats from 'automation/stats.js';

/* 

This is the main entrypoint for all automation. It's purpose is, and will eventually
be the key to coordinating all resources and batch hacks. 

This should only ever link to automation and math helper libraries for calculating what 
to do and is intended to be a one-time run & die daemon init to spawn the worker daemons.

Potentially in the future there may be a watcher daemon to pass status between services.

*/

/** @param {import("../common").NS} ns */

export async function main(ns) { 
    //start stat exporter
    await stats.grafana(ns);

    //start distribute
    await distribute.replicate(ns);
    ns.tprint("Initializing File Replicators.");
    await ns.sleep(5000); // Try to make all scripts start at different times
    await distribute.root(ns);
    ns.tprint("Initializing RCEs.");
    await ns.sleep(5000);

    //start file discovery
    await distribute.finderKeeper(ns);
    ns.tprint("Initializing file scrapers.");
    await ns.sleep(5000);

    //start cloudcompute
    await cloudcompute.provision(ns, 8);
    ns.tprint("Purchasing first servers.");
    await ns.sleep(5000); 

    //start hacknet
    await hacknetManager.startBuying(ns);
    ns.tprint("Initializing hacknet manager.");
    await ns.sleep(5000);

    ns.tprint(`
    Helpful alias commands:
    \talias init="run execute.js" --tail
    \talias get="run tools/genData.js"
    \talias hackabit="run hacks/node-hgw.js"
    ${"-".repeat(80)}
    `);
}
