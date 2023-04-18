import StatusSwarm from "../statuses/monster/status-swarm.js";
import StatusStrength from "../statuses/monster/status-strength.js";

const ATTACKS = {
    simple: {
        id: 'simple',
        intent: 0,
        windupTime: 5000,
        color: 0xffaf3f,
        action: (messenger) => {
            messenger.dealDamageToPlayer(0);
        }
    },
    reform: {
        id: 'reform',
        intent: 15,
        windupTime: 7500,
        color: 0x3f3f3f,
        action: (messenger) => {
            messenger.applyStatusToMonster(StatusStrength, -1, 8);
        }
    },
    swarm: {
        id: 'swarm',
        intent: 15,
        windupTime: 0,
        color: 0x3f7fff,
        action: (messenger) => {
            messenger.applyStatusToMonster(StatusSwarm, -1);
        }
    }
}

const Junebug = {
    texture: 'junebug',
    flying: true,
    background: 0,
    health: 200,
    nextAttack: (i, history, messenger) => {
        if(i === 0) {
            return ATTACKS.swarm;
        }
        if(history[history.length - 1] === 'reform') {
            return ATTACKS.simple;
        }
        if(messenger.getStatusStacks(StatusStrength) <= 0) {
            return ATTACKS.reform;
        }
        return ATTACKS.simple;
    },
}

export default Junebug