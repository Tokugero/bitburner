import * as replicate from "./tools/replicate.js";
import * as stealFiles from "./tools/stealFiles.js";

// Distribute hacks where server is rooted

/** @param {import("../../common").NS} ns */

export async function sendAndHack(ns) {
    ns.exec('/tools/hackEverything.js', "home");
    await replicate.replicate(ns);
    await replicate.hack(ns);
}

export async function finderKeeper(ns) {
    await stealFiles.findChallenges(ns);
}