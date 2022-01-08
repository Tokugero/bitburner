/** @param {import("../../common").NS} ns */

// Stop all running hacks on all systems.

export async function main(ns) {
	var servers = ns.scan()

	servers.forEach(function(element, index, list) {
		ns.killall(servers[index]);
	})
}

// Stop hacks on given system types.