const StatusHealOnSpawn = {
    color: 0x3fff00,
    intent: 20,
    priority: 0,
    apply: () => {
        return new HealOnSpawn();
    }
}

class HealOnSpawn {

    _stacks = 0;

    addStacks = (stacks) => {
        this._stacks += stacks;
    }

    getStacks = () => {
        return this._stacks;
    }

    onCombSpawned = (comb, messenger) => {
        messenger.healMonster(this._stacks);
    }

}

export default StatusHealOnSpawn;