const SHRINK_RATE = 0.003;

class ShrinkComponent {

    _entity;
    _sprite;

    constructor(entity, sprite) {
        this._entity = entity;
        this._sprite = sprite;
    }

    update = (delta) => {
        if(this._entity.state === 'shrinking') {
            this._entity.size -= delta * SHRINK_RATE;
            if(this._entity.size <= 0) {
                this._entity.size = 0;
                this._entity.state = 'gone';
            }
            this._sprite.setScale(this._entity.fullScale * this._entity.size, this._entity.fullScale * this._entity.size);
            this._sprite.material.opacity = this._entity.size;
        }
    }
}

export default ShrinkComponent;