// Distribute hacks where server is rooted

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
    ns.exec('tools/stealFiles.js', 'home', 1);
}