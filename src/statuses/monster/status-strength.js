const StatusStrength = {
    id: 'strength',
    color: 0xff3f3f,
    intent: 13,
    priority: 1,
    apply: () => {
        return new Strength();
    }
}

class Strength {

    _stacks = 0;

    addStacks = (stacks) => {
        this._stacks += stacks;
    }

    getStacks = () => {
        return this._stacks;
    }

    onAttackPlayer = (damage) => {
        damage.value += this._stacks;
    }

}

export default StatusStrength;