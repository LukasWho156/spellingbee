import { getLetterFreqs } from "../language/get-random-letter.js";

const ATTACKS = {
    simple: {
        id: 'simple',
        intent: 0,
        windupTime: 5000,
        color: 0xffaf3f,
        action: (fightSystem) => {
            fightSystem.dealDamageToPlayer(5);
        }
    },
    dung: {
        id: 'dung',
        intent: 2,
        windupTime: 5000,
        color: 0x6f5f00,
        action: (fightSystem) => {
            const freqs = Object.entries(getLetterFreqs());
            freqs.sort((a, b) => a[1] - b[1]);
            const combs = fightSystem.getRandomCombs(1);
            for(const comb of combs) {
                comb.state = 'rotten';
                comb.replacement = freqs[Math.floor(Math.random() * 10)][0]
            }
        }
    }
}

const DungBeetle = {
    texture: 'dungBeetle',
    health: 750,
    nextAttack: (i, history) => {
        if(i === 0) {
            return ATTACKS.dung;
        }
        let chance = 0;
        let index = history.length - 1;
        while(history[index] === 'simple') {
            chance += 0.1;
            index--;
        }
        if(Math.random() < chance) {
            return ATTACKS.dung;
        }
        return ATTACKS.simple;
    },
}

export default DungBeetle