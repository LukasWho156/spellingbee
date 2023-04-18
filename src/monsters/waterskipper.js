import StatusDiluted from "../statuses/combs/status-diluted.js";

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
    dilute: {
        id: 'dilute',
        intent: 3,
        windupTime: 5000,
        color: 0xff3f3f,
        action: (messenger) => {
            const combs = messenger.getRandomCombs(3);
            for(const comb of combs) {
                messenger.applyStatusToComb(comb, StatusDiluted);
            }
        }
    }
}

const Waterskipper = {
    texture: 'waterskipper',
    background: 4,
    health: 350,
    nextAttack: (i, history) => {
        if(i === 0) {
            return ATTACKS.dilute;
        }
        let chance = 0;
        let index = history.length - 1;
        while(history[index] === 'simple') {
            chance += 0.1;
            index--;
        }
        if(Math.random() < chance) {
            return ATTACKS.dilute;
        }
        return ATTACKS.simple;
    },
}

export default Waterskipper