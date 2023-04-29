import StatusTapped from "../statuses/combs/status-tapped.js";

const ATTACKS = {
    simple: {
        id: 'simple',
        replacements: [5],
        intent: 0,
        windupTime: 6000,
        color: 0xffaf3f,
        action: (messenger) => {
            messenger.dealDamageToPlayer(5);
        }
    },
    tap: {
        id: 'tap',
        replacements: [1],
        intent: 6,
        windupTime: 6000,
        color: 0x3faf3f,
        action: (messenger) => {
            const combs = messenger.getRandomCombs(1);
            for(const comb of combs) {
                messenger.applyStatusToComb(comb, StatusTapped);
            }
        }
    }
}

const Butterfly = {
    texture: 'butterfly',
    background: 0,
    flying: true,
    health: 200,
    nextAttack: (i, history) => {
        if(i === 0) {
            return ATTACKS.tap;
        }
        let chance = 0;
        let index = history.length - 1;
        while(history[index] === 'simple') {
            chance += 0.1;
            index--;
        }
        if(Math.random() < chance) {
            return ATTACKS.tap;
        }
        return ATTACKS.simple;
    },
}

export default Butterfly