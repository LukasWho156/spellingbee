class BopComponent {

    _entity;
    _sprite;
    _baseScaleX;
    _baseScaleY;

    constructor(entity, sprite) {
        this._entity = entity;
        this._sprite = sprite;
        this._baseScaleX = sprite.scale.x;
        this._baseScaleY = sprite.scale.y;
    }

    update = (delta, globalTime) => {
        if(this._entity.health <= 0) return;
        const value = Math.sin((globalTime * this._entity.bopFrequency + this._entity.bopOffset) * Math.PI * 2);
        this._sprite.setScale(this._entity.size * (1 + value * this._entity.bopX), this._entity.size * (1 - value * this._entity.bopY));
    }

}

export default BopComponent