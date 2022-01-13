import * as arrayJumpingGame from './tools/contractTypes/arrayJumpingGame.js';

/** @param {import("../../common/.").NS} ns */

export async function main(ns){
    return;
}

/** @param {import("../../common/.").NS} ns */

export async function handle(ns, contractFile, server){
    games = getHandledTypes(ns);

    var type = ns.codingcontract.getContractType(contractFile, server.hostname);
    var data = ns.codingcontract.getData(contractFile, server.hostname);
    
    var answer = games[type].solve(data);

    var reward = ns.codingcontract.attempt(answer, contractFile, server, {returnReward: true});
    return reward;
}

export async function getHandledTypes(){
    var games = {
        "Array Jumping Game": arrayJumpingGame
    };

    return games;
}