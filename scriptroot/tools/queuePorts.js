/** @param {import("../common").NS} ns */
export async function main(ns) {
};

/** @param {import("../common").NS} ns */
export async function peekQueue(ns, port) {
    for (let i = 0; i < 3; i++) {
        if (ns.peek(port) != "NULL PORT DATA") {
            const parsed = JSON.parse(ns.peek(port));
            ns.print(parsed);
            return parsed;
        } else {
            ns.print("Retrying peek... " + port);
            await ns.sleep(1000);
        }
    }
    ns.print("Failed to peek queue " + port);
    return "NULL PORT DATA";
}

/** @param {import("../common").NS} ns */
export async function writeQueue(ns, port, data) {
    for (let i = 0; i < 3; i++) {
        if (await ns.tryWritePort(port, JSON.stringify(data))) {
            ns.print("Successfully wrote to queue " + port);
            return;
        } else {
            ns.print("Retrying write... " + port);
            await ns.sleep(1000);
        }
    }
    ns.print("Failed to write to queue " + port);
    return "NULL PORT DATA";
}

/** @param {import("../common").NS} ns */
export async function readQueue(ns, port) {
    for (let i = 0; i < 3; i++) {
        const result = await ns.readPort(port);
        if (result != "NULL PORT DATA") {
            const parsed = JSON.parse(result);
            ns.print(parsed);
            return parsed;
        } else {
            ns.print("Retrying read... " + port);
            await ns.sleep(1000);
        }
    }
    ns.print("Failed to read from queue " + port);
    return "NULL PORT DATA";
}

/** @param {import("../common").NS} ns */
export async function clearQueue(ns, port) {
    await ns.clearPort(port);
}