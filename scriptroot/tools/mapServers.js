/*
The crux of many daemons to get a list of all servers in the purview of the player. All items
in this list are a full detail object that defines the server, and includes some extra meta-data
to help other functions. 

Any definitions that should describe the server, should be stored here.

Don't access this directly, use queuePorts.peekQueue(env.serverListQueue) to get a list of all servers.
*/

/** @param {import("../../common/.").NS} ns */

export async function main(ns) {
    await getAllServers(ns);
}

/** @param {import("../../common/.").NS} ns */

export async function getAllServers(ns) {
    let start = ns.getServer("home");
    let results = await getServersDetails(ns, start);

    return results;
}

/** @param {import("../../common/.").NS} ns */

async function getServersDetails(ns, parentNode, origin = parentNode, trail = [], branch = []) {
    // TODO: refactor this to be key filterable rather than just a list
    let base = ns.scan(parentNode.hostname);
    trail = [...trail, parentNode.hostname];
    for (const server of base) {
        if (server !== parentNode.hostname && server !== origin.hostname) {
            let files = ns.ls(server);
            let serverDetails = ns.getServer(server);
            serverDetails.files = files;
            serverDetails.trail = trail;

            branch.push(serverDetails);
            branch = branch.concat(await getServersDetails(ns, serverDetails, parentNode, trail));
        };
    };
    return branch;
}
