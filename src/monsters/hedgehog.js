import StatusBallUp from "../statuses/monster/status-ball-up.js";

const ATTACKS = {
    simple: {
        id: 'simple',
        replacements: [5],
        intent: 0,
        windupTime: 6000,
        color: 0xffaf3f,
        action: (fightSystem) => {
            fightSystem.dealDamageToPlayer(5);
        }
    },
    ballup: {
        id: 'ballup',
        intent: 0,
        windupTime: 0,
        color: 0xafafaf,
        action: (messenger) => {
            messenger.applyStatusToMonster(StatusBallUp, -1, 5)
        }
    }
}

const Hedgehog = {
    texture: 'hedgehog',
    background: 1,
    health: 250,
    nextAttack: (i, history) => {
        if (i == 0) {
            return ATTACKS.ballup;
        }
        return ATTACKS.simple;
    },
}

export default Hedgehog