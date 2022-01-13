import * as mapServers from './tools/mapServers.js';
import * as contractHandler from './tools/contractHandler.js';

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
            for (const file of findFiles){
                var contractType = ns.codingcontract.getContractType(file, server.hostname);
                if ( contractType in contractHandler.getHandledTypes()) {
                    ns.tprint(`Solved Contract for: ${contractHandler.handle(ns, file, server)}`);
                } else {
                    challenges += "FOUND CCT CHALLENGE: " + file + " ON: " + server.hostname + "\n";
                };
            };
        };
        await ns.sleep(20);
    };
    ns.write("/data/challenges.txt", challenges, "w");

}