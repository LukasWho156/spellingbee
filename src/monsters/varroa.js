import StatusHealOnSpawn from "../statuses/monster/status-heal-on-spawn.js";

const ATTACKS = {
    simple: {
        id: 'simple',
        replacements: [5],
        intent: 0,
        windupTime: 5000,
        color: 0xffaf3f,
        action: (fightSystem) => {
            fightSystem.dealDamageToPlayer(5);
        }
    },
    parasite: {
        id: 'parasite',
        intent: 0,
        windupTime: 0,
        color: 0xafafaf,
        action: (messenger) => {
            messenger.applyStatusToMonster(StatusHealOnSpawn, -1, 1)
        }
    }
}

const Varroa = {
    texture: 'varroa',
    background: 1,
    health: 250,
    nextAttack: (i, history) => {
        if (i == 0) {
            return ATTACKS.parasite;
        }
        return ATTACKS.simple;
    },
}

export default Varroa;