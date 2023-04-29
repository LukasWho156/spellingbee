import StatusStrength from "./status-strength.js";

const StatusSwarm = {
    id: 'swarm',
    color: 0xbf6f4f,
    intent: 15,
    priority: 0,
    apply: () => {
        return new Swarm();
    }
}

class Swarm {

    onAttacked = (messenger) => {
        messenger.applyStatusToMonster(StatusStrength, -1, -1);
    }

}

export default StatusSwarm;