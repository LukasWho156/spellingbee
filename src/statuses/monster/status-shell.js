const StatusShell = {
    id: 'shell',
    color: 0x9f5f3f,
    intent: 18,
    priority: 0,
    apply: () => {
        return new Shell();
    }
}

class Shell {

    _stacks = 0;

    addStacks = (stacks) => {
        this._stacks += stacks;
    }

    getStacks = () => {
        return this._stacks;
    }

    onDamageCalculation = (damage, wordLength, messenger) => {
        if(this._stacks > 0) {
            messenger.applyStatusToMonster(StatusShell, -1, -1);
            return 0;
        }
        return damage;
    }

}

export default StatusShell;