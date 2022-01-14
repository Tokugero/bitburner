/** @param {import("../../common/.").NS} ns */

//var allServers = [];

export async function main(ns) {
    await getAllServers(ns);
    // sample
    // for (const server of allServers) {
    //     ns.print(server.parent.hostname);
    // }
    // allServers = [];
}

/** @param {import("../../common/.").NS} ns */

export async function getAllServers(ns) {
    var start = ns.getServer("home");
    var results = await getServersDetails(ns, start);
    return results;
}

/** @param {import("../../common/.").NS} ns */

async function getServersDetails(ns, parentNode, origin = parentNode, trail = [], branch = []) {
    // TODO: refactor this to be key filterable rather than just a list
    var base = ns.scan(parentNode.hostname);
    trail = [...trail, parentNode.hostname];
    for (const server of base) {
        if (server !== parentNode.hostname && server !== origin.hostname) {
            var files = ns.ls(server);
            var serverDetails = ns.getServer(server);
            serverDetails.files = files;
            serverDetails.trail = trail;
            branch.push(serverDetails);
            branch = branch.concat(await getServersDetails(ns, serverDetails, parentNode, trail)); 
        };
    };
    return branch;
}
