import { THREE } from "luthe-amp";

const DECAY_RATE = 0.05;

class DamagedComponent {

    _entity;
    _sprite;
    _center;

    constructor(entity, sprite) {
        this._entity = entity;
        this._sprite = sprite;
        this._center = sprite.position.clone();
    }

    update = (delta) => {
        if(this._entity.health <= 0) return;
        const restColor = Math.floor(0xff * (1 - this._entity.hurt));
        const green = restColor << 8;
        const color = 0xff0000 + green + restColor;
        this._sprite.material.color.set(color);
        this._sprite.position.copy(
            new THREE.Vector3(-20, 0, 0).multiplyScalar(this._entity.hurt * Math.sin(this._entity.hurt * 6.28)).add(
                this._center
            )
        );
        this._entity.hurt *= (1 - DECAY_RATE);
    }

}

export default DamagedComponent;