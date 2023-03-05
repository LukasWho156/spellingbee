const GROWTH_RATE = 0.002;

class CombStatusComponent {

    _state;
    _percentage;

    get isDead() {
        return this._state === 'dead';
    }

    constructor(status, messenger) {
        this._status = status;
        this._status.onApply ??= () => {};
        this._status.beforeAccept ??= () => {}
        this._status.onAccept ??= () => {}
        this._status.onPop ??= () => {}
        this._status.onDie ??= () => {}
        this._status.onGrow ??= (percentage) => {};
        this._status.onUpdate ??= (delta, globalTime) => {};
        this._status.onShrink ??= (percentage) => {};
        this._status.isDead ??= () => false;
        this._state = 'applied';
        this._percentage = 0;
        this._messenger = messenger;
    }

    onApply = () => {
        this._status.onApply(this._messenger);
    }

    beforeAccept = () => {
        this._status.beforeAccept(this._messenger);
    }

    onAccept = (multiplier) => {
        this._status.onAccept(this._messenger, multiplier);
        this._state = 'dead';
    }

    onPop = () => {
        this._status.onPop(this._messenger);
        this._state = 'dead';
    }

    remove = () => {
        this._state = 'removed';
    }
    
    update = (delta, globalTime) => {
        switch(this._state) {
            case 'applied':
                this._percentage += GROWTH_RATE * delta;
                if(this._percentage >= 1) {
                    this._percentage = 1;
                    this._state = 'active';
                }
                this._status.onGrow(this._percentage);
                break;
            case 'active':
                this._status.onUpdate(delta, globalTime, this._messenger)
                break;
            case 'removed':
                this._percentage -= GROWTH_RATE * delta;
                if(this._percentage <= 0) {
                    this._percentage = 0;
                    this._state = 'dead';
                    this._status.onDie();
                }
                this._status.onShrink(this._percentage);
                break;
        }
    }

}

export default CombStatusComponent;