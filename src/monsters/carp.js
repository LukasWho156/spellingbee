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
    mouth: {
        id: 'mouth',
        intent: 2,
        windupTime: 5000,
        color: 0x6f5f00,
        action: (fightSystem) => {
            const combs = fightSystem.getRandomCombs(4);
            for(const comb of combs) {
                comb.state = 'rotten';
                comb.replacement = 'O';
            }
        }
    }
}

const Carp = {
    texture: 'carp',
    flying: true,
    background: 3,
    health: 300,
    nextAttack: (i, history) => {
        if(i === 0) {
            return ATTACKS.mouth;
        }
        let chance = 0;
        let index = history.length - 1;
        while(history[index] === 'simple') {
            chance += 0.1;
            index--;
        }
        if(Math.random() < chance) {
            return ATTACKS.mouth;
        }
        return ATTACKS.simple;
    },
}

export default Carp