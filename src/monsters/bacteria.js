import StatusInfected from "../statuses/combs/status-infected.js";

const ATTACKS = {
    attack: {
        id: 'attack',
        intent: 10,
        windupTime: 5000,
        color: 0x3fff3f,
        action: (messenger) => {
            const afflictedCount = messenger.countStatuses(StatusInfected);
            messenger.dealDamageToPlayer(afflictedCount);
        }
    },
    infect: {
        id: 'infect',
        intent: 9,
        windupTime: 5000,
        color: 0x3fff7f,
        action: (messenger) => {
            const combs = messenger.getRandomCombs(3);
            for(const comb of combs) {
                messenger.applyStatusToComb(comb, StatusInfected);
            }
        }
    }
}

const Bacteria = {
    texture: 'bacteria',
    background: 1,
    health: 800,
    nextAttack: (i, history, messenger) => {
        const chance = 1 - messenger.countStatuses(StatusInfected) * 0.2;
        if(Math.random() < chance) {
            return ATTACKS.infect;
        }
        return ATTACKS.attack;
    },
}

export default Bacteria