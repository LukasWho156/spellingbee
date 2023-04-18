import StatusDamage from "./status-damage.js";
import StatusFreeze from "./status-freeze.js";
import StatusHealth from "./status-health.js";
import StatusSting from "./status-sting.js";
import StatusWeaken from "./status-weaken.js";

const BUFFS = [
    StatusHealth,
    StatusFreeze,
    StatusSting,
    StatusDamage,
    StatusWeaken,
]

// BUFFS[0], Math.random()

const getRandomBuff = () => {
    const amount = BUFFS.length;
    const i = Math.floor(Math.random() * amount);
    return BUFFS[i];
}

export default getRandomBuff;