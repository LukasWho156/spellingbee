import StatusScratched from "../statuses/combs/status-scratched.js";

const ATTACKS = {
    simple: {
        id: 'simple',
        replacements: [7],
        intent: 0,
        windupTime: 5000,
        color: 0xffaf3f,
        action: (messenger) => {
            messenger.dealDamageToPlayer(7);
        }
    },
    scratch: {
        id: 'scratch',
        replacements: [4, 3],
        intent: 3,
        windupTime: 5000,
        color: 0xff3f3f,
        action: (messenger) => {
            messenger.dealDamageToPlayer(4);
            const combs = messenger.getRandomCombs(3);
            for(const comb of combs) {
                messenger.applyStatusToComb(comb, StatusScratched);
            }
        }
    }
}

const Cat = {
    texture: 'cat',
    background: 5,
    health: 350,
    nextAttack: (i, history) => {
        if(i === 0) {
            return ATTACKS.scratch;
        }
        let chance = 0;
        let index = history.length - 1;
        while(history[index] === 'simple') {
            chance += 0.1;
            index--;
        }
        if(Math.random() < chance) {
            return ATTACKS.scratch;
        }
        return ATTACKS.simple;
    },
}

export default Cat