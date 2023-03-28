import StatusSlimed from "../statuses/combs/status-slimed.js";

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
    sneeze: {
        id: 'sneeze',
        intent: 8,
        windupTime: 5000,
        color: 0x3fff3f,
        action: (messenger) => {
            const combs = messenger.getRandomCombs(5);
            for(const comb of combs) {
                messenger.applyStatusToComb(comb, StatusSlimed);
            }
        }
    }
}

const Beekeeper = {
    texture: 'beekeeper',
    background: 1,
    health: 800,
    nextAttack: (i, history) => {
        if(i === 0) {
            return ATTACKS.sneeze;
        }
        let chance = 0;
        let index = history.length - 1;
        while(history[index] === 'simple') {
            chance += 0.1;
            index--;
        }
        if(Math.random() < chance) {
            return ATTACKS.sneeze;
        }
        return ATTACKS.simple;
    },
}

export default Beekeeper