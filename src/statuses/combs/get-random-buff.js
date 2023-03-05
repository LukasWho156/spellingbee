import StatusDamage from "./status-damage.js";
import StatusFreeze from "./status-freeze.js";
import StatusHealth from "./status-health.js";
import StatusSting from "./status-sting.js";

const BUFFS = [
    StatusHealth,
    StatusFreeze,
    StatusSting,
    StatusDamage,
]

// BUFFS[0], Math.random()

const getRandomBuff = () => {
    const amount = BUFFS.length;
    const i = Math.floor(Math.random() * amount);
    return BUFFS[i];
}

export default getRandomBuff;