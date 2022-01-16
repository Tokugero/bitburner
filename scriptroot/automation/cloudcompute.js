/** @param {import("../../common").NS} ns */

export async function provision(ns, ramcount){
    ns.exec('/tools/provision.js', 'home', 1, ramcount);
};
