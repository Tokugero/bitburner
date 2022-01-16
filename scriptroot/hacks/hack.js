/** @param {import("../../common").NS} ns */

export async function main(ns) {
    const args = ns.flags([]);
    let stolen = await ns.hack(args._[0]);
	ns.print(`Stole ${stolen} from ${args._[0]}`);
}