const StatusSpiky = {
    id: 'spiky',
    color: 0xafafaf,
    intent: 4,
    apply: () => {
        return new Spiky();
    }
}

class Spiky {

    _stacks = 0;

    addStacks = (stacks) => {
        this._stacks += stacks;
    }

    getStacks = () => {
        return this._stacks;
    }

    onAttacked = (messenger) => {
        messenger.dealDamageToPlayer(this._stacks, true);
    }

}

export default StatusSpiky;