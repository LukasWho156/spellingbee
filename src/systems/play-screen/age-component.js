const AGE_RATE = 1 / 30_000;

class AgeComponent {

    _entity;
    _sprite;
    _messenger;

    constructor(entity, sprite, messenger) {
        this._entity = entity;
        this._sprite = sprite;
        this._messenger = messenger;
    }

    update = (delta) => {
        if(this._messenger.isPaused()) return;
        if(this._entity.state !== 'ready' && this._entity.state !== 'selected') {
            return;
        }
        this._entity.age += delta * AGE_RATE * this._entity.ageRate;
        if(this._entity.age - this._entity.ageStage >= 1) {
            this._entity.ageStage++;
            if(this._entity.ageStage > 3) {
                this._entity.state = 'rotten';
                return;
            }
            this._sprite.setFrame(this._entity.ageStage);
        }
    }

}

export default AgeComponent;