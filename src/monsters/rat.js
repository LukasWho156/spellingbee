import StatusPoisoned from "../statuses/combs/status-poisoned.js";
import StatusScratched from "../statuses/combs/status-scratched.js";

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
    scratch: {
        id: 'scratch',
        replacements: [2, 2],
        intent: 3,
        windupTime: 5000,
        color: 0xff7f7f,
        action: (messenger) => {
            messenger.dealDamageToPlayer(2);
            const combs = messenger.getRandomCombs(2);
            for(const comb of combs) {
                messenger.applyStatusToComb(comb, StatusScratched);
            }
        }
    },
    bite: {
        id: 'bite',
        replacements: [5, 2],
        intent: 14,
        windupTime: 5000,
        color: 0xff3f3f,
        action: (messenger) => {
            messenger.dealDamageToPlayer(5);
            const combs = messenger.getRandomCombs(2);
            for(const comb of combs) {
                messenger.applyStatusToComb(comb, StatusPoisoned);
            }
        }
    }
}

const Rat = {
    texture: 'rat',
    background: 5,
    health: 350,
    nextAttack: (i, history) => {
        if(i === 0) {
            return ATTACKS.bite;
        }
        let chance = 0;
        let index = history.length - 1;
        while(history[index] === 'simple') {
            chance += 0.2;
            index--;
        }
        if(Math.random() < chance) {
            if(Math.random() < 0.5) {
                return ATTACKS.bite;
            }
            return ATTACKS.scratch;
        }
        return ATTACKS.simple;
    },
}

export default Rat