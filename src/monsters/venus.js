import StatusTrapped from "../statuses/combs/status-trapped.js";

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
    trap: {
        id: 'trap',
        intent: 16,
        windupTime: 5000,
        color: 0x3faf3f,
        action: (messenger) => {
            const allCombs = messenger.getRandomCombs(19);
            allCombs.forEach(comb => messenger.removeStatusFromComb(comb, StatusTrapped))
            const combs = messenger.getRandomCombs(5);
            for(const comb of combs) {
                messenger.applyStatusToComb(comb, StatusTrapped);
            }
        }
    }
}

const Venus = {
    texture: 'venus',
    background: 4,
    health: 350,
    nextAttack: (i, history) => {
        if(i === 0) {
            return ATTACKS.trap;
        }
        let chance = 0;
        let index = history.length - 1;
        while(history[index] === 'simple') {
            chance += 0.1;
            index--;
        }
        if(Math.random() < chance) {
            return ATTACKS.trap;
        }
        return ATTACKS.simple;
    },
}

export default Venus