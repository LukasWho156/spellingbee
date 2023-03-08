const GROWTH_RATE = 0.003;

class GrowthComponent {

    _entity;
    _sprite;
    _growthRate;

    constructor(entity, sprite, growthRate) {
        this._entity = entity;
        this._sprite = sprite;
        this._growthRate = growthRate ?? GROWTH_RATE;
    }

    update = (delta) => {
        if(this._entity.state === 'growing') {
            this._entity.size += delta * this._growthRate;
            if(this._entity.size >= 1) {
                this._entity.size = 1;
                this._entity.state = 'ready';
            }
            if(this._sprite.setScale) {
                this._sprite.setScale(this._entity.fullScale * this._entity.size, this._entity.fullScale * this._entity.size);
            } else {
                this._sprite.scale.set(this._entity.fullScale * this._entity.size, this._entity.fullScale * this._entity.size, 1);
            }
            this._sprite.material.opacity = this._entity.size;
        }
    }
}

export default GrowthComponent;