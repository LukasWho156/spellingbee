const StatusStrength = {
    id: 'spiky',
    color: 0xff3f3f,
    intent: 13,
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
        console.log(damage);
        damage.value += this._stacks;
    }

}

export default StatusStrength;