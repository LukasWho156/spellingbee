import StatusDamage from "../statuses/combs/status-damage.js";
import StatusFreeze from "../statuses/combs/status-freeze.js";
import StatusFrozen from "../statuses/combs/status-frozen.js";
import StatusHealth from "../statuses/combs/status-health.js";
import StatusSting from "../statuses/combs/status-sting.js";
import StatusTarget from "../statuses/combs/status-target.js";
import StatusWeaken from "../statuses/combs/status-weaken.js";
import StatusDefenseUp from "../statuses/monster/status-defense-up.js";
import StatusPowerUp from "../statuses/monster/status-power-up.js";
import StatusTargetBuffs from "../statuses/monster/status-target-buffs.js";

const ATTACKS = {
    simple: {
        id: 'simple',
        replacements: [5],
        intent: 0,
        windupTime: 5000,
        color: 0xffaf3f,
        action: (messenger) => {
            messenger.dealDamageToPlayer(5);
        }
    },
    eat: {
        id: 'toadEat',
        intent: 25,
        windupTime: 2000,
        color: 0x3f7fff,
        action: (messenger) => {
            const bs = messenger.getAffectedCombs(StatusTarget);
            for(const comb of bs) {
                comb.state = 'rotten';
                comb.statuses.forEach(s => {
                    if(s.status === StatusDamage) {
                        messenger.dealDamageToPlayer(25);
                    }
                    if(s.status === StatusHealth) {
                        messenger.healMonster(15);
                    }
                    if(s.status === StatusWeaken) {
                        messenger.applyStatusToMonster(StatusPowerUp, 20_000);
                    }
                    if(s.status === StatusSting) {
                        messenger.applyStatusToMonster(StatusDefenseUp, 10_000);
                    }
                    if(s.status === StatusFreeze) {
                        messenger.deselectAll();
                        for(const comb of messenger.getRandomCombs(19)) {
                            messenger.applyStatusToComb(comb, StatusFrozen);
                        }
                    }
                })
            }
        }
    },
    targetBuffs: {
        id: 'targetBuffs',
        intent: 20,
        windupTime: 0,
        color: 0x3f7fff,
        action: (messenger) => {
            messenger.applyStatusToMonster(StatusTargetBuffs, -1);
        }
    }
}

const Toad = {
    texture: 'toad',
    background: 4,
    health: 600,
    nextAttack: (i, history, messenger) => {
        if(i === 0) {
            return ATTACKS.targetBuffs;
        }
        if(history[history.length - 1] === 'toadEat') {
            return ATTACKS.simple;
        }
        if(messenger.countStatuses(StatusTarget) > 0) {
            return ATTACKS.eat;
        }
        return ATTACKS.simple;
    },
}

export default Toad