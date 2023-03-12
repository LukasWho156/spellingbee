import { THREE, Game } from "luthe-amp";
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";

const StatusPoisoned = {
    apply: (comb, sprite) => {
        return new Poisoned(comb, sprite);
    }
}

class Poisoned {

    _comb;
    _combSprite;
    _poisonSprite;
    _shadowSprite;
    _rotation;
    _poisonTimer;

    constructor(comb, combSprite) {
        this._comb = comb;
        this._combSprite = combSprite;
        this._shadowSprite = new Sprite2D({
            texture: Game.getTexture('shadow'),
            z: 3,
        })
        this._poisonSprite = new Sprite2D({
            texture: Game.getTexture('combIcons'),
            z: 2,
        });
        this._poisonSprite.setFrame(12);
        this._rotation = 0;
        this._poisonTimer = 1500;
    }

    onApply = () => {
        this._shadowSprite.scale.set(1.2, 1.2, 1);
        this._shadowSprite.material.opacity = 0;
        this._shadowSprite.material.color.set(0x7f0000);
        this._shadowSprite.material.blending = THREE.AdditiveBlending;
        this._combSprite.add(this._shadowSprite);
        this._poisonSprite.scale.set(0, 0, 1);
        this._combSprite.add(this._poisonSprite);
        this._comb.ageRate *= 2;
    }

    onGrow = (percentage) => {
        this._poisonSprite.material.opacity = percentage * 0.8;
        this._poisonSprite.scale.set(percentage, percentage, 1);
    }

    onUpdate = (delta, globalTime, messenger) => {
        this._poisonTimer -= delta;
        this._shadowSprite.material.opacity *= 0.9;
        if(this._poisonTimer < 0) {
            messenger.dealDamageToPlayer(1, true);
            this._shadowSprite.material.opacity = 0.5;
            for(let i = 0; i < 3; i++) {
                messenger.spawnParticleOverComb(this._comb, {
                    frame: 7,
                    velocity: new THREE.Vector3(0, 0.1, 0),
                    opacity: 1,
                    size: 0.3,
                    fadeRate: 0.001,
                    color: 0x7f0000,
                    blending: THREE.AdditiveBlending,
                });
            }
            this._poisonTimer = 1500;
        }
    }

    onShrink = this.onGrow;

    onDie = () => {
        this._combSprite.remove(this._poisonSprite);
        this._combSprite.remove(this._shadowSprite);
    }

}

export default StatusPoisoned;