/*

This daemon init process is responsible for any actions involved in sleeves

*/

/** @param {import("../../common").NS} ns */

export async function grafana(ns) {
    ns.exec('tools/sleeves/manageSleeves.js', 'home', 1);
    ns.exec('tools/sleeves/manageSleeveMetrics.js', 'home', 1);
}