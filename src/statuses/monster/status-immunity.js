const StatusImmunity = {
    id: 'immunity',
    color: 0xaf7f00,
    intent: 19,
    priority: 0,
    apply: () => {
        return new Immunity();
    }
}

class Immunity {

    _stacks = 0;

    addStacks = (stacks) => {
        this._stacks += stacks;
    }

    getStacks = () => {
        return this._stacks;
    }

    onDamageCalculation = (damage, wordLength) => {
        if(wordLength <= this._stacks) {
            return 0;
        }
        return damage;
    }

}

export default StatusImmunity;