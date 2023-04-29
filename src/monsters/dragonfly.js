import StatusWhirled from "../statuses/combs/status-whirled.js";

const ATTACKS = {
    simple: {
        id: 'simple',
        replacements: [5],
        intent: 0,
        windupTime: 4000,
        color: 0xffaf3f,
        action: (messenger) => {
            messenger.dealDamageToPlayer(5);
        }
    },
    whirl: {
        id: 'whirl',
        replacements: [3],
        intent: 7,
        windupTime: 4000,
        color: 0x3f7faf,
        action: (messenger) => {
            const combs = messenger.getRandomCombs(3);
            for(const comb of combs) {
                messenger.applyStatusToComb(comb, StatusWhirled);
            }
        }
    }
}

const Dragonfly = {
    texture: 'dragonfly',
    background: 4,
    flying: true,
    health: 300,
    nextAttack: (i, history) => {
        if(i === 0) {
            return ATTACKS.whirl;
        }
        let chance = 0;
        let index = history.length - 1;
        while(history[index] === 'simple') {
            chance += 0.1;
            index--;
        }
        if(Math.random() < chance) {
            return ATTACKS.whirl;
        }
        return ATTACKS.simple;
    },
}

export default Dragonfly