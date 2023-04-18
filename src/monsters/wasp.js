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
}

const Wasp = {
    texture: 'wasp',
    background: 0,
    health: 200,
    nextAttack: (i, history) => {
        return ATTACKS.simple;
    },
}

export default Wasp