import StatusDamage from "../combs/status-damage.js";
import StatusFreeze from "../combs/status-freeze.js";
import StatusHealth from "../combs/status-health.js";
import StatusSting from "../combs/status-sting.js";
import StatusTarget from "../combs/status-target.js";
import StatusWeaken from "../combs/status-weaken.js";

const BUFFS = [
    StatusDamage,
    StatusWeaken,
    StatusSting,
    StatusFreeze,
    StatusHealth,
]

const StatusTargetBuffs = {
    id: 'targetBuffs',
    color: 0x3fafff,
    intent: 21,
    priority: 0,
    apply: () => {
        return new TargetBuffs();
    }
}

class TargetBuffs {

    onCombSpawned = (comb, messenger) => {
        comb.statuses.forEach(s => {
            if(BUFFS.find(b => b === s.status)) {
                messenger.applyStatusToComb(comb, StatusTarget);
            }
        })
    }

}

export default StatusTargetBuffs;