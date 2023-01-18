import * as env from '.env.js';
import * as qp from './tools/queuePorts.js';
import * as mg from './tools/manageGrafana.js';

/** @param {import("../common").NS} ns */
export async function main(ns) {
    await sleeves(ns);
    await sleeveMonitoring(ns);
    await ns.spawn("tools/sleeves/queueSleeves.js", 1);
};

/** @param {import("../common").NS} ns */
async function sleeves(ns) {
    const sleeveCount = ns.sleeve.getNumSleeves();
    const sleeves = [];

    for (let i = 0; i < sleeveCount; i++) {
        const sleeveStats = {
            "stats": ns.sleeve.getSleeve(i),
            "task": (ns.sleeve.getTask(i) != "Idle" ? ns.sleeve.getTask(i) : null),
            "augs": ns.sleeve.getSleeveAugmentations(i)
        }
        sleeves.push(sleeveStats);
    }

    await qp.clearQueue(ns, env.sleeveQueue);

    await qp.writeQueue(ns, env.sleeveQueue, sleeves);
    ns.print(await qp.peekQueue(ns, env.sleeveQueue));
};

/** @param {import("../common").NS} ns */
export async function sleeveMonitoring(ns) {
    const sleeves = await qp.peekQueue(ns, env.sleeveQueue);

    for (const sleeve in sleeves) {
        await mg.submitMetrics(ns, "sleeve", sleeve,
            [
                { "name": "agi", "value": sleeves[sleeve].skills.agility },
                { "name": "str", "value": sleeves[sleeve].skills.strength },
                { "name": "cha", "value": sleeves[sleeve].skills.charisma },
                { "name": "def", "value": sleeves[sleeve].skills.defense },
                { "name": "dex", "value": sleeves[sleeve].skills.dexterity },
                { "name": "hacking", "value": sleeves[sleeve].skills.hacking },
                { "name": "memory", "value": sleeves[sleeve].skills.memory },
                { "name": "shock", "value": sleeves[sleeve].skills.shock },
                { "name": "sync", "value": sleeves[sleeve].skills.sync },
                { "name": "task", "value": (sleeves[sleeve].task ? sleeves[sleeve].task.type : "") }
            ]
        );
    };
};