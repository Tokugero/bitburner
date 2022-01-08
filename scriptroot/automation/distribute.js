/** @param {import("../../common").NS} ns */
import * as replicate from "hacks/replicate.js";
// Distribute hacks where server is rooted

export async function sendAndHack(ns, parentServer) {
    await replicate.virus(ns, parentServer);
}