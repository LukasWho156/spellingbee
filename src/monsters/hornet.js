import StatusPoisoned from "../statuses/combs/status-poisoned.js";

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
    sting: {
        id: 'sting',
        intent: 10,
        windupTime: 5000,
        color: 0xff3f3f,
        action: (messenger) => {
            const combs = messenger.getRandomCombs(1);
            for(const comb of combs) {
                messenger.applyStatusToComb(comb, StatusPoisoned);
            }
        }
    }
}

const Hornet = {
    texture: 'hornet',
    background: 0,
    health: 200,
    nextAttack: (i, history) => {
        if(i === 0) {
            return ATTACKS.sting;
        }
        let chance = 0;
        let index = history.length - 1;
        while(history[index] === 'simple') {
            chance += 0.2;
            index--;
        }
        if(Math.random() < chance) {
            return ATTACKS.sting;
        }
        return ATTACKS.simple;
    },
}

export default Hornet