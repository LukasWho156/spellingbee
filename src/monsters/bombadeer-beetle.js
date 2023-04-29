import StatusBomb from "../statuses/combs/status-bomb.js";

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
    bomb: {
        id: 'bomb',
        replacements: [3],
        windupTime: 5000,
        color: 0xff3f3f,
        intent: 17,
        action: (messenger) => {
            const combs = messenger.getRandomCombs(3);
            for(const comb of combs) {
                messenger.applyStatusToComb(comb, StatusBomb);
            }
        }
    }
}

const BombadeerBeetle = {
    texture: 'bombadeerBeetle',
    background: 2,
    health: 250,
    nextAttack: (i, history) => {
        if(i === 0) {
            return ATTACKS.bomb;
        }
        let chance = 0;
        let index = history.length - 1;
        while(history[index] === 'simple') {
            chance += 0.1;
            index--;
        }
        if(Math.random() < chance) {
            return ATTACKS.bomb;
        }
        return ATTACKS.simple;
    },
}

export default BombadeerBeetle