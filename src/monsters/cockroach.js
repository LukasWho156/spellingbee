import StatusShell from "../statuses/monster/status-shell.js";

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
    shell: {
        id: 'shell',
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
    flying: true,
    background: 4,
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