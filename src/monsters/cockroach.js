import StatusShell from "../statuses/monster/status-shell.js";

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
    shell: {
        id: 'shell',
        replacements: [3],
        intent: 18,
        windupTime: 10000,
        color: 0x9f5f3f,
        action: (messenger) => {
            messenger.applyStatusToMonster(StatusShell, -1, 3);
        }
    },
}

const Cockroach = {
    texture: 'cockroach',
    background: 5,
    health: 350,
    nextAttack: (i, history, messenger) => {
        if(history[history.length - 1] === 'shell') {
            return ATTACKS.simple;
        }
        if(messenger.getStatusStacks(StatusShell) <= 0) {
            return ATTACKS.shell;
        }
        return ATTACKS.simple;
    },
}

export default Cockroach;