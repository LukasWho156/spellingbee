import StatusFire from "../statuses/combs/status-fire.js";

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
    burn: {
        id: 'burn',
        replacements: [3],
        windupTime: 5000,
        color: 0xff3f00,
        intent: 31,
        action: (messenger) => {
            const combs = messenger.getRandomCombs(3);
            for(const comb of combs) {
                messenger.applyStatusToComb(comb, StatusFire);
            }
        }
    }
}

const FireAnt = {
    texture: 'fireant',
    background: 2,
    health: 250,
    nextAttack: (i, history) => {
        if(i === 0) {
            return ATTACKS.burn;
        }
        let chance = 0;
        let index = history.length - 1;
        while(history[index] === 'simple') {
            chance += 0.1;
            index--;
        }
        if(Math.random() < chance) {
            return ATTACKS.burn;
        }
        return ATTACKS.simple;
    },
}

export default FireAnt