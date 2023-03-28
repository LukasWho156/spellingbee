const StatusBSpawner = {
    color: 0x3fafff,
    intent: 11,
    apply: () => {
        return new BSpawner();
    }
}

class BSpawner {

    onCombSpawned = (comb) => {
        console.log('spawned', comb);
        if(Math.random() < 0.1) {
            comb.letter = 'B';
        }
    }

}

export default StatusBSpawner;