import * as mapServers from './tools/mapServers';

/** @param {import("../../common/.").NS} ns */

export async function main(ns){
    await findChallenges(ns);
    ns.spawn("/tools/stealFiles.js");
}

/** @param {import("../../common/.").NS} ns */

export async function findChallenges(ns){
    var allServers = await mapServers.getAllServers(ns);
    var challenges = "";
    for (const server of allServers){
        var findFiles = ns.ls(server.hostname, ".cct");
        if (findFiles.length > 0){
            challenges += "FOUND CCT CHALLENGE: " + findFiles + " ON: " + server.hostname + "\n";
        }
        await ns.sleep(20);
    };
    ns.write("/data/challenges.txt", challenges, "w");

}