import * as mapServers from '../mapServers.js';
import * as contractHandler from './contractHandler.js';

/*

This Daemon serves to find all interesting files across all servers and either aggregate them 
to /data/challenges.txt (etc) or to auto-solve challenges it finds. It is currently 
assumed there is no other interesting files other than light lore and .cct challenges.

*/
/** @param {import("../../../common").NS} ns */

export async function main(ns) {
    await findChallenges(ns);
    ns.spawn("/tools/contracts/stealFiles.js");
}

/** @param {import("../../../common").NS} ns */

export async function findChallenges(ns) {
    var allServers = await mapServers.getAllServers(ns);
    var challenges = "";
    let handledTypes = contractHandler.getHandledTypes()
    for (const server of allServers) {
        var findFiles = ns.ls(server.hostname, ".cct");
        if (findFiles.length > 0) {
            for (const file of findFiles) {
                var contractType = ns.codingcontract.getContractType(file, server.hostname);
                if (handledTypes.includes(contractType)) {
                    ns.tprint(`Solved Contract for: ${await contractHandler.handle(ns, file, server, contractType)}`);
                } else {
                    challenges += `
                        ${"#".repeat(80)}
                        Challenge: ${file} - On: ${server.hostname} 
                        Type: ${contractType}
                        ${"-".repeat(80)}
                        ${ns.codingcontract.getDescription(file, server.hostname)} `;
                };
            };
        };
    };
    ns.write("/data/challenges.txt", challenges, "w");
}
