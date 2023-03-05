import StatusWebbed from "../statuses/combs/status-webbed.js";

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
    web: {
        id: 'web',
        windupTime: 5000,
        color: 0xafafaf,
        intent: 1,
        action: (messenger) => {
            const combs = messenger.getRandomCombs(3);
            for(const comb of combs) {
                messenger.applyStatusToComb(comb, StatusWebbed);
            }
        }
    }
}

const Spider = {
    texture: 'spider',
    health: 750,
    nextAttack: (i, history) => {
        if(i === 0) {
            return ATTACKS.web;
        }
        let chance = 0;
        let index = history.length - 1;
        while(history[index] === 'simple') {
            chance += 0.1;
            index--;
        }
        if(Math.random() < chance) {
            return ATTACKS.web;
        }
        return ATTACKS.simple;
    },
}

export default Spider