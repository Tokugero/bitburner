/** @param {import("../../common/.").NS} ns */

export async function main(ns){ return; };

export async function solve(ns, data){ 
    /* You are given the following array of integers:
        6,3,0,6,0,1,8,6,3,3,5,0,5
    Each element in the array represents your MAXIMUM jump length at that position. 
    This means that if you are at position i and your maximum jump length is n, you can jump to any position from i to i+n. 
    Assuming you are initially positioned at the start of the array, determine whether you are able to reach the last index exactly.
    Your answer should be submitted as 1 or 0, representing true and false respectively */
    var place = 0;
    var cont = true;
    var maxTry = 9001;

    while(maxTry > 0){
        maxTry--;
        var maxJump = data[place];

        if (data[place] == data.length){
            return 1;
        };

        var highestVal = 1;
        var nextStep = 0;
        var tmpArray = data.slice(place, (place+maxJump));
        for (const step in tmpArray){
            var nextHop = (tmpArray[step]+place);
            if (nextHop == data.length){
                return 1;
            } else if (nextHop >= highestVal){
                highestVal = nextHop;
                nextStep = step;
                cont = true;
            };
        };

        place = parseInt(place)+parseInt(nextStep)+1;
    };

    return 0;
};
