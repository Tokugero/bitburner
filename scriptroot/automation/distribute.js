/*

This daemon init process is responsible for any actions involved in 
rooting boxes and establishing presence in the game.

*/

/** @param {import("../../common").NS} ns */

export async function root(ns) {
    ns.exec('/tools/hackEverything.js', 'home', 1);
}

/** @param {import("../../common").NS} ns */

export async function replicate(ns) {
    ns.exec('/tools/replicate.js', 'home', 1);
}

/** @param {import("../../common").NS} ns */

export async function finderKeeper(ns) {
    ns.exec('/tools/contracts/stealFiles.js', 'home', 1);
}