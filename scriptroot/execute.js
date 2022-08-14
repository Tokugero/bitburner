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

////////////////////////////////////////////////////////////////////////////////////////////
//  Static configs
////////////////////////////////////////////////////////////////////////////////////////////

const sleep = 1000;

////////////////////////////////////////////////////////////////////////////////////////////
//  Startup sequences
////////////////////////////////////////////////////////////////////////////////////////////

/** @param {import("../common").NS} ns */

export async function main(ns) {
    //start stat exporter
    await stats.grafana(ns);
    ns.tprint("Initializing monitoring.");

    //start distribute
    await distribute.replicate(ns);
    ns.tprint("Initializing File Replicators.");
    await ns.sleep(sleep); // Try to make all scripts start at different times

    //start hacking downstream nodes
    await distribute.root(ns);
    ns.tprint("Initializing RCEs.");
    await ns.sleep(sleep);

    //start file discovery
    await distribute.finderKeeper(ns);
    ns.tprint("Initializing file scrapers.");
    await ns.sleep(sleep);

    //start cloudcompute
    await cloudcompute.provision(ns);
    ns.tprint("Purchasing first servers.");
    await ns.sleep(5000);

    //start hacknet
    await hacknetManager.startBuying(ns);
    ns.tprint("Initializing hacknet manager.");
    await ns.sleep(sleep);

    //start hacking
    ns.tprint("Initializing hacking a bit.");
    ns.exec("hacks/node-hgw.js", "home");

    ////share overhead
    ns.tprint("Initializing hacking contract extension.");
    ns.exec("hacks/share.js", "home");

    ns.tprint(`
    Helpful alias commands:
    \talias init="run execute.js" --tail
    \talias get="run tools/genData.js"
    \talias hackabit="run hacks/node-hgw.js"
    \talias spread="run tools/replicate.js"
    ${"-".repeat(80)}
    `);
}
