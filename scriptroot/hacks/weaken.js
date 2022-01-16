/** @param {import("../../common").NS} ns */

export async function main(ns) {
    const args = ns.flags([]);
    await ns.weaken(args._[0]);
}