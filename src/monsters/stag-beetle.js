import StatusSpiky from "../statuses/monster/status-spiky.js";

const ATTACKS = {
    simple: {
        id: 'simple',
        intent: 0,
        windupTime: 7500,
        color: 0xffaf3f,
        action: (fightSystem) => {
            fightSystem.dealDamageToPlayer(5);
        }
    },
    defend: {
        id: 'defend',
        intent: 0,
        windupTime: 0,
        color: 0xafafaf,
        action: (messenger) => {
            messenger.applyStatusToMonster(StatusSpiky, -1)
        }
    }
}

const StagBeetle = {
    texture: 'stagBeetle',
    background: 2,
    health: 750,
    nextAttack: (i, history) => {
        if (i == 0) {
            return ATTACKS.defend;
        }
        return ATTACKS.simple;
    },
}

export default StagBeetle