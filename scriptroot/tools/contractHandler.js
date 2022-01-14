import * as arrayJumpingGame from './tools/contractTypes/arrayJumpingGame.js';

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
        default:
            ns.print(`Contract type not handled yet.`);
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