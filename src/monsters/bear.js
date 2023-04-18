import StatusTarget from "../statuses/combs/status-target.js";
import StatusStrength from "../statuses/monster/status-strength.js";

const ATTACKS = {
    simple: {
        id: 'simple',
        intent: 0,
        windupTime: 5000,
        color: 0xffaf3f,
        action: (messenger) => {
            messenger.dealDamageToPlayer(5);
        }
    },
    target: {
        id: 'target',
        intent: 20,
        windupTime: 2500,
        color: 0xff003f,
        action: (messenger) => {
            const combs = messenger.getRandomCombs(1);
            for(const comb of combs) {
                messenger.applyStatusToComb(comb, StatusTarget);
            }
        }
    },
    eat: {
        id: 'eat',
        intent: 11,
        windupTime: 5000,
        color: 0x3f7fff,
        action: (messenger) => {
            const bs = messenger.getAffectedCombs(StatusTarget);
            for(const comb of bs) {
                comb.state = 'rotten';
                messenger.healMonster(15);
                messenger.applyStatusToMonster(StatusStrength, -1, 2);
            }
        }
    },
}

const Bear = {
    texture: 'bear',
    background: 2,
    health: 500,
    nextAttack: (i, history, messenger) => {
        if(i === 0) {
            return ATTACKS.target;
        }
        if(history[history.length - 1] === 'target') {
            return ATTACKS.eat;
        }
        let chance = 0;
        let index = history.length - 1;
        while(history[index] === 'simple') {
            chance += 0.1;
            index--;
        }
        if(Math.random() < chance) {
            return ATTACKS.target;
        }
        return ATTACKS.simple;
    },
}

export default Bear