import * as arrayJumpingGame from '../tools/contracts/contractTypes/arrayJumpingGame.js';
import * as totalWaysToSum from '../tools/contracts/contractTypes/totalWaysToSum.js';
import * as uniquePathsInAGridI from '../tools/contracts/contractTypes/uniquePathsInAGridI.js';

/*

This is called any time a new contract is found. As new /tools/contractTypes are validated,
add them to this list to let the /tools/stealFiles daemon auto-break them.

*/

/** @param {import("../../common/.").NS} ns */

export async function main(ns) {
    return;
}

/** @param {import("../../common/.").NS} ns */

export async function handle(ns, contractFile, server, contractType) {
    var data = ns.codingcontract.getData(contractFile, server.hostname);
    let answer = "";
    switch (contractType) {
        case 'Array Jumping Game':
            answer = arrayJumpingGame.solve(data);
            break;
        case 'Total Ways to Sum':
            answer = totalWaysToSum.solve(data);
            break;
        case 'Unique Paths in a Grid I':
            answer = uniquePathsInAGridI.solve(data);
            break;
        default:
            ns.print(`Contract type not handled yet.`);
            break;
    };
    if (answer !== "") {
        let reward = ns.codingcontract.attempt(answer, contractFile, server.hostname, { returnReward: true });
        if (reward !== "") {
            ns.tprint(`Contract ${contractType} solved for ${reward}`);
            return reward;
        } else {
            ns.tprint(`Attempted to solve ${contractType} on ${server.hostname} with the following answer, but it failed:
            \t${answer}
            The info was:
            \t${ns.codingcontract.getData(contractFile, server.hostname)} `);
        }
    } else {
        return "Just kidding, you failed to answer anything. Debug me!";
    };
}

export function getHandledTypes() {
    var games = [
        "Array Jumping Game",
        "Total Ways to Sum",
        "Unique Paths in a Grid I"
    ];

    return games;
}