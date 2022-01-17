import * as arrayJumpingGame from './tools/contractTypes/arrayJumpingGame.js';

/*

This is called any time a new contract is found. As new /tools/contractTypes are validated,
add them to this list to let the /tools/stealFiles daemon auto-break them.

*/

/** @param {import("../../common/.").NS} ns */

export async function main(ns){
    return;
}

/** @param {import("../../common/.").NS} ns */

export async function handle(ns, contractFile, server, contractType){
    var data = ns.codingcontract.getData(contractFile, server.hostname);
    let answer = "";
    switch (contractType) {
        case 'Array Jumping Game':
            answer = arrayJumpingGame.solve(data);
            break;
        default:
            ns.print(`Contract type not handled yet.`);
            break;
    };
    if (answer !== ""){
        let reward = ns.codingcontract.attempt(answer, contractFile, server.hostname, {returnReward: true});
        return reward;
    } else {
        return "Just kidding, you failed to answer anything. Debug me!";
    };
}

export function getHandledTypes(){
    var games = ["Array Jumping Game"];

    return games;
}