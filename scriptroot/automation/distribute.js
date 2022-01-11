import * as replicate from "tools/replicate.js";

// Distribute hacks where server is rooted

/** @param {import("../../common").NS} ns */

export async function sendAndHack(ns) {
    ns.exec('tools/hackEverything.js', "home", 1);
    await replicate.replicate(ns);
    await replicate.hack(ns);
}

export async function finderKeeper(ns) {
    ns.exec('tools/stealFiles.js', "home", 1);
}