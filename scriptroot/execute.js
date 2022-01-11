import * as cloudcompute from 'automation/cloudcompute.js';
import * as distribute from 'automation/distribute.js';
import * as hacknet from 'automation/hacknet.js';
import * as root_boxes from 'automation/root-boxes.js';
import * as stats from 'automation/stats.js';


/** @param {import("../common").NS} ns */

export async function main(ns) { 
    //start distribute
    await distribute.sendAndHack(ns);
    //start file discovery
    await distribute.finderKeeper(ns);
    //start stats
    //start cloudcompute
    await cloudcompute.provision(ns);
    //start hacknet
}

