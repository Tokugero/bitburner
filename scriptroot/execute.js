/** @param {import("../common").NS} ns */
import * as cloudcompute from 'automation/cloudcompute.js';
import * as distribute from 'automation/distribute.js';
import * as hacknet from 'automation/hacknet.js';
import * as root_boxes from 'automation/root-boxes.js';
import * as stats from 'automation/stats.js';

// Manage and start/stop all avaialable automation jobs.

export async function main(ns) { 
//start distribute
    await distribute.sendAndHack(ns, "home");
//start stats
//start cloudcompute
    await cloudcompute.provision(ns);
//start hacknet
}

//wait x time and do over