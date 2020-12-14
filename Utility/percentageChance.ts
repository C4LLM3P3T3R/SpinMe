import { arrayShuffle } from "./arrayShuffle";


export function percentageChance(values, chances) {
    for (var i = 0, pool = []; i < chances.length; i++) {
        for (var i2 = 0; i2 < chances[i]; i2++) {
            pool.push(i);
        }
    }
    return values[arrayShuffle(pool)['0']];
}
