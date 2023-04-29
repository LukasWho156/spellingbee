import StatusTarget from "../combs/status-target.js";

const StatusBSpawner = {
    id: 'bSpawner',
    color: 0x3fafff,
    intent: 11,
    priority: 0,
    apply: () => {
        return new BSpawner();
    }
}

class BSpawner {

    onCombSpawned = (comb, messenger) => {
        if(Math.random() < 0.1 && comb.letter !== '*') {
            comb.letter = 'B';
        }
        if(comb.letter === 'B') {
            messenger.applyStatusToComb(comb, StatusTarget);
        }
    }

}

export default StatusBSpawner;