import { THREE } from "luthe-amp";

const DECAY_RATE = 0.005;

class AttackComponent {

    _entity;
    _sprite;

    constructor(entity, sprite) {
        this._entity = entity;
        this._sprite = sprite;
    }

    update = (delta) => {
        if(this._entity.health <= 0) return;
        this._sprite.position.add(new THREE.Vector3(0, -40, 0).multiplyScalar(Math.sin(this._entity.attacked * Math.PI)));
        this._entity.attacked -= delta * DECAY_RATE;
        if(this._entity.attacked < 0) this._entity.attacked = 0;
    }

}

export default AttackComponent;