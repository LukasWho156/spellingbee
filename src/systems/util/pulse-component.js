class PulseComponent {

    _entity;
    _sprite;

    constructor(entity, sprite) {
        this._entity = entity;
        this._sprite = sprite;
    }

    update = (delta, globalTime) => {
        if(this._entity.health <= 0) return;
        const value = Math.sin((globalTime * this._entity.pulseFrequency) * Math.PI * 2);
        const size = (1 + this._entity.pulseAmplitude * value) * this._entity.fullScale;
        this._sprite.scale.set(size, size, 1);
    }

}

export default PulseComponent