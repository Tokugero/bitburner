import * as cloudcompute from 'automation/cloudcompute.js';
import * as distribute from 'automation/distribute.js';
import * as hacknetManager from 'automation/hacknet.js';
import * as stats from 'automation/stats.js';
import * as caching from 'automation/caching.js';
import * as env from '.env.js';

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
    //start caches
    await caching.cache(ns);
    ns.tprint("Initializing caching services")
    await ns.sleep(sleep);

    //start stat exporter
    await stats.grafana(ns);
    ns.tprint("Initializing monitoring.");
    await ns.sleep(sleep);

    //start distribute
    await distribute.replicate(ns);
    ns.tprint("Initializing File Replicators.");
    await ns.sleep(sleep); // Try to make all scripts start at different times

    //start hacking downstream nodes
    await distribute.root(ns);
    ns.tprint("Initializing RCEs.");
    await ns.sleep(sleep);

    //start cloudcompute
    await cloudcompute.provision(ns);
    ns.tprint("Initializing provisioner.");
    await ns.sleep(5000);

    //start hacknet
    if (env.enableHacknet) {
        await hacknetManager.startBuying(ns);
        ns.tprint("Initializing hacknet manager.");
        await ns.sleep(sleep);
    } else if (!env.enableHacknet) { ns.tprint("Hacknet disabled."); };

    if (ns.getServerMaxRam("home") >= env.homehgwBuffer + env.hostMemoryFloor + env.hgwMemoryBuffer) {
        //start hacking
        ns.tprint("Initializing hacking a bit.");
        ns.exec("hacks/node-hgw.js", "home");
    } else { ns.tprint("Hacking disabled due to insufficient memory for control plane.") }

    if (ns.getServerMaxRam("home") >= env.homehgwBuffer + env.hostMemoryFloor) {
        //start file discovery
        await distribute.finderKeeper(ns);
        ns.tprint("Initializing file scrapers.");
    } else { ns.tprint("File discovery disabled due to insufficient memory for control plane.") }

    ns.tprint(`
    Helpful alias commands:
    \talias init="run execute.js" --tail
    \talias get="run tools/genData.js"
    \talias hackabit="run hacks/node-hgw.js"
    \talias spread="run tools/replicate.js"
    ${"-".repeat(80)}
    `);
}
