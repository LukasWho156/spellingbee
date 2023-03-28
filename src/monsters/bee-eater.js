import StatusBSpawner from "../statuses/monster/status-b-spawner.js";
import StatusStrength from "../statuses/monster/status-strength.js";

const ATTACKS = {
    simple: {
        id: 'simple',
        intent: 0,
        windupTime: 7500,
        color: 0xffaf3f,
        action: (messenger) => {
            messenger.dealDamageToPlayer(1);
        }
    },
    eat: {
        id: 'eat',
        intent: 11,
        windupTime: 5000,
        color: 0x3f7fff,
        action: (messenger) => {
            const bs = messenger.getLetteredCombs('B');
            for(const comb of bs) {
                comb.state = 'rotten';
                messenger.healMonster(15);
                messenger.applyStatusToMonster(StatusStrength, -1, 1);
            }
        }
    },
    spawnBs: {
        id: 'spawnBs',
        intent: 11,
        windupTime: 0,
        color: 0x3f7fff,
        action: (messenger) => {
            messenger.applyStatusToMonster(StatusBSpawner, -1);
        }
    }
}

const BeeEater = {
    texture: 'beeEater',
    flying: true,
    background: 0,
    health: 400,
    nextAttack: (i, history, messenger) => {
        if(i === 0) {
            return ATTACKS.spawnBs;
        }
        if(history[history.length - 1] === 'eat') {
            return ATTACKS.simple;
        }
        const bs = messenger.getLetteredCombs('B');
        if(bs.length > 0) {
            return ATTACKS.eat;
        }
        return ATTACKS.simple;
    },
}

export default BeeEater