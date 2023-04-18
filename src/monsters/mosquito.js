import StatusPoisoned from "../statuses/combs/status-poisoned.js";
import StatusTapped from "../statuses/combs/status-tapped.js";

const ATTACKS = {
    simple: {
        id: 'simple',
        intent: 0,
        windupTime: 6000,
        color: 0xffaf3f,
        action: (messenger) => {
            messenger.dealDamageToPlayer(5);
        }
    },
    suck: {
        id: 'suck',
        intent: 6,
        windupTime: 6000,
        color: 0xaf3f3f,
        action: (messenger) => {
            const combs = messenger.getRandomCombs(2);
            for(const comb of combs) {
                messenger.applyStatusToComb(comb, StatusTapped);
                messenger.applyStatusToComb(comb, StatusPoisoned);
            }
        }
    }
}

const Mosquito = {
    texture: 'mosquito',
    background: 3,
    health: 300,
    nextAttack: (i, history) => {
        if(i === 0) {
            return ATTACKS.suck;
        }
        let chance = 0;
        let index = history.length - 1;
        while(history[index] === 'simple') {
            chance += 0.1;
            index--;
        }
        if(Math.random() < chance) {
            return ATTACKS.suck;
        }
        return ATTACKS.simple;
    },
}

export default Mosquito