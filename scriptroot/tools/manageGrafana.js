import * as env from ".env.js";
import * as qp from "./tools/queuePorts.js";

/** @param {import("../common").NS} ns */
export async function main(ns) {
    while (true) {
        await flushQueue(ns);
        await ns.sleep(10000);
    };
};


// other things to get with queue env.monitoringQueue

// server specific stats (already doing this)
// player specific stats
// query nodes in hackingQueues
// Sleeve status
// update hacking specific data
// Hacknet status?

// format queue and dump into influx


// expects object as follows:
/*
[{
    "tag": "server", // see telegraf.conf for valid tags or add your own
    "tagvalue": "home",
    "metrics": [
        {
            "name": "moneyAvailable",
            "value": 100
        },
        {...}
    ]
},{...}
]
*/
/** @param {import("../common").NS} ns */
export async function flushQueue(ns) {
    while (true) {
        let monitor = await qp.readQueue(ns, env.monitoringQueue);
        if (monitor == "NULL PORT DATA") { break; };

        let uri = `${env.url}${monitor.tag}=${monitor.tagValue}&`
        for (const metric of monitor.metrics) {
            uri = uri + `${metric.name}=${metric.value}&`
        }
        uri = uri.substring(0, uri.length - 1);
        await wget(ns, uri);

    }
};

/** @param {import("../common").NS} ns */
export async function submitMetrics(ns, tag, tagValue, metrics) {
    let metricsParsed = [];
    for (const metric of metrics) {
        metricsParsed.push({ "name": metric.name, "value": metric.value });
    };
    let monitorObject = { "tag": tag, "tagValue": tagValue, "metrics": metricsParsed };

    await qp.writeQueue(ns, env.monitoringQueue, monitorObject);

    ns.print("Wrote some metrics, check influx.");
}

/** @param {import("../common").NS} ns */
async function wget(ns, url) {
    for (let i = 0; i < 3; i++) {
        if (await ns.wget(url, `/dev/null.txt`)) {
            ns.print(`Wrote ${url}`);
            return true;
        } else {
            ns.print("Retrying wget... " + url);
            await ns.sleep(100);
        }
    }
    return false;
}