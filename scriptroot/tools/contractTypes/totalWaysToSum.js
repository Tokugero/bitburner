/** @param {import("../../common/.").NS} ns */

export function main(){ return; };

export function solve(data){ 
/* It is possible write four as a sum in exactly four different ways:

    3 + 1
    2 + 2
    2 + 1 + 1
    1 + 1 + 1 + 1

How many different ways can the number 87 be written as a sum of at least two positive integers? */

    let solution = canSplit(ns, data);

    return solution;
};

function canSplit(ns, data){
    // Credit for my poor life decisions and failings as an adult https://www.geeksforgeeks.org/ways-to-write-n-as-sum-of-two-or-more-positive-integers/
    let table = new Array(data + 1);
    
    for(let i = 0; i < data + 1; i++)
    {
        table[i]=0;
    }
    
    table[0] = 1;

    for (let i = 1; i < data; i++)
        for (let j = i; j <= data; j++)
            table[j] += table[j - i];
    
    return table[data];
};