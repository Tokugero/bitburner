/** @param {import("../../common").NS} ns */
import * as replicate from "tools/replicate.js";
import * as bruteforce from "tools/hackEverything";
// Distribute hacks where server is rooted

export async function sendAndHack(ns) {
    await bruteforce.gracefulHack(ns);
    await replicate.replicate(ns);
    await replicate.hack(ns);
}