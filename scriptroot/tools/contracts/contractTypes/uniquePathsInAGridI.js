/** @param {import("../../common/.").NS} ns */

export function main(ns) { ns.tprint(solve([2,14])) };

export function solve(data) {
    /* You are in a grid with 12 rows and 9 columns, and you are positioned in the top-left corner of that grid. 
    You are trying to reach the bottom-right corner of the grid, but you can only move down or right on each step. 
    Determine how many unique paths there are from start to finish.
    
    NOTE: The data returned for this contract is an array with the number of rows and columns:
    
    [12, 9] */
    let mutate = ((data[0] - 1) * (data[1]));

    let solution = mutate;

    return solution;
};