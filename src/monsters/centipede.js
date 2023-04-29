import StatusImmunity from "../statuses/monster/status-immunity.js";

const ATTACKS = {
    simple: {
        id: 'simple',
        replacements: [5],
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
            messenger.applyStatusToMonster(StatusImmunity, -1, 3)
        }
    }
}

const Centipede = {
    texture: 'centipede',
    background: 1,
    health: 250,
    nextAttack: (i, history) => {
        if (i == 0) {
            return ATTACKS.defend;
        }
        return ATTACKS.simple;
    },
}

export default Centipede