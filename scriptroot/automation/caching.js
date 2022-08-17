/*

This daemon init process is responsible for any actions involved in 
provisioning purchasable servers and managing them.

*/

/** @param {import("../../common").NS} ns */

export async function cache(ns) {
    ns.exec('/tools/manageCache.js', 'home', 1);
};
