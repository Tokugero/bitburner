/** @param {import("../../common/.").NS} ns */

export function main() { return; };

export function solve(data) {
    /* You are given the following array of stock prices (which are numbers) where the i-th element represents the stock price on day i:
    
    73,99,137,92,67,170,8,20,194
    
    Determine the maximum possible profit you can earn using at most two transactions. A transaction is defined as buying and then selling one share of the stock. Note that you cannot engage in multiple transactions at once. In other words, you must sell the stock before you buy it again.
    
    If no profit can be made, then the answer should be 0 */

    let profit = 0;
    let answers = [];

    let minimum = data[0];
    let maximum = data[0];
    for (const day in data) {
        if (day + 1 >= data.length) {
            break;
        } else if (data[day] < data[(day + 1)]) {
            minimum = day;
        } else if (data[day] > data[(day + 1)]) {
            maximum = day;
        };
    };

    return profit;
}

