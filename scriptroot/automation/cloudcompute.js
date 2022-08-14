/*

This daemon init process is responsible for any actions involved in 
provisioning purchasable servers and managing them.

*/

/** @param {import("../../common").NS} ns */

export async function provision(ns, ramcount) {
    ns.exec('/tools/provision.js', 'home', 1);
};
