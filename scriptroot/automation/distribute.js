/**
* @param {NS} ns
**/

export async function main(ns) {
    var servers = await ns.scan()
    var files = await ns.ls("home","/generic/")

    for (const server of servers) {
        var scpStatus = await ns.scp(files,"home",server);
        ns.tprintf('%s: scp with status %s', server, scpStatus);
        var execStatus = ns.exec('generic/easy.js', server);
        ns.tprintf('%s: exec with status %s', server, execStatus);
    }
}