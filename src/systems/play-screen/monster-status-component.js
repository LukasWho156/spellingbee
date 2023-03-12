class MonsterStatusComponent {

    _status;
    _decayRate;
    _stacks;
    _value;
    _messenger;

    get value() {
        return this._value;
    }

    get stacks() {
        return this._stacks;
    }

    get isDead() {
        return this._value < 0;
    }

    constructor(status, time, messenger, stacks) {
        this._status = status;
        this._decayRate = (time > 0) ? 1 / time : 0;
        this._messenger = messenger;
        this._value = 1;
        status.onApply ??= () => {};
        status.onUpdate ??= () => {};
        status.onDamageCalculation ??= (damage) => damage;
        status.onAttacked ??= () => {};
        status.onDie ??= () => {};
        status.addStacks ??= () => {};
        status.getStacks ??= () => 0;
        if(stacks) this.addStacks(stacks);
    }

    onApply = () => {
        this._status.onApply(this._messenger);
    }

    onDamageCalculation = (damage) => {
        return this._status.onDamageCalculation(damage);
    }

    onAttacked = () => {
        this._status.onAttacked(this._messenger);
    }

    addTime = (time) => {
        if(time <= 0) return;
        const remainingTime = this._value / this._decayRate;
        const newTime = remainingTime + time;
        this._decayRate = 1 / newTime;
        this._value = 1;
    }

    addStacks = (stacks) => {
        this._status.addStacks(stacks);
        this._stacks = this._status.getStacks();
    }

    remove = () => {
        this._value = 0;
    }

    update = (delta, globalTime) => {
        this._value -= this._decayRate * delta;
        if(this._value > 0 && typeof(status.setCustomValue) === 'function') {
            this._value = status.setCustomValue(this._messenger);
        }
        if(this._value <= 0) {
            this._status.onDie(this._messenger);
        } else {
            this._status.onUpdate(delta, globalTime, this._messenger);
        }
    }

}

export default MonsterStatusComponent