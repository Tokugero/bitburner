import * as replicate from "tools/replicate.js";
import * as bruteforce from "tools/hackEverything";
// Distribute hacks where server is rooted

/** @param {import("../../common").NS} ns */

export async function sendAndHack(ns) {
    ns.exec('tools/hackEverything.js', "home", 1);
    await replicate.replicate(ns);
    await replicate.hack(ns);
}