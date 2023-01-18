// A set of tools to debug the queue system.

import * as env from '.env.js';
import * as qp from '/tools/queuePorts.js';

/** @param {import("../common").NS} ns */

export async function main(ns) {

    let queues = {
        "monitoring": env.monitoringQueue,
        "bigHacking": env.bigHackingQueue,
        "bigHackingIP": env.bigHackingIPQueue,
        "bigHackingDB": env.bigHackingDB,
        "smallHacking": env.smallHackingQueue,
        "smallHackingIP": env.smallHackingIPQueue,
        "smallHacking": env.smallHackingDB,
        "contract": env.contractQueue,
        "serverList": env.serverListQueue,
        "sleeve": env.sleeveQueue,
        "faction": env.factionQueue,
        "testing": env.testingQueue
    }
    //for (let item of Object.keys(queues)) {
    //    let queue = await qp.peekQueue(ns, queues[item]);
    //    // print queue name, queue count, new line, first entry if available
    //    if (queue != "NULL PORT DATA") {
    //        ns.tprint("Queue Name: ", item, " | Queue Count: ", queue.length);
    //    } else {
    //        ns.tprint("Queue Name: ", item, " | EMPTY QUEUE");
    //    }
    //}

    ns.tprint("Queue Name: ", "bigHacking", " | Queue Count: ", await qp.peekQueue(ns, env.bigHackingQueue));
}