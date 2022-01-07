/**
* @param {NS} ns
**/

export async function main(ns) {
	var servers = await ns.scan()

	servers.forEach(function(element, index, list) {
		await ns.killall(servers[index]);
	})
}