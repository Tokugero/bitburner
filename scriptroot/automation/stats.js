/*

This daemon init process is responsible for any actions involved in establishing
data with grafana.

*/

/** @param {import("../../common").NS} ns */

export async function grafana(ns) {
    ns.exec('tools/manageGrafana.js', 'home', 1);
    ns.exec('tools/grafana.js', 'home', 1);
}