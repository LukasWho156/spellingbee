import { THREE, Game } from "luthe-amp";
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";

const StatusTapped = {
    apply: (comb, sprite) => {
        return new Tapped(comb, sprite);
    }
}

class Tapped {

    _comb;
    _combSprite;
    _tapSprite;
    _shadowSprite;
    _rotation;
    _tapTimer;

    constructor(comb, combSprite) {
        this._comb = comb;
        this._combSprite = combSprite;
        this._shadowSprite = new Sprite2D({
            texture: Game.getTexture('shadow'),
            z: 3,
        })
        this._tapSprite = new Sprite2D({
            texture: Game.getTexture('combIcons'),
            z: 2,
        });
        this._tapSprite.setFrame(10);
        this._rotation = 0;
        this._tapTimer = 1500;
    }

    onApply = () => {
        this._shadowSprite.scale.set(1.2, 1.2, 1);
        this._shadowSprite.material.opacity = 0;
        this._shadowSprite.material.color.set(0x7f0000);
        this._shadowSprite.material.blending = THREE.AdditiveBlending;
        this._combSprite.add(this._shadowSprite);
        this._tapSprite.scale.set(0, 0, 1);
        this._combSprite.add(this._tapSprite);
        this._comb.ageRate *= 2;
    }

    onGrow = (percentage) => {
        this._tapSprite.material.opacity = percentage * 1;
        this._tapSprite.scale.set(percentage, percentage, 1);
    }

    onUpdate = (delta, globalTime, messenger) => {
        this._rotation += 0.001 * delta;
        this._tapSprite.setRotation(this._rotation);
        this._tapTimer -= delta;
        this._shadowSprite.material.opacity *= 0.9;
        if(this._tapTimer < 0) {
            messenger.healMonster(1);
            this._shadowSprite.material.opacity = 0.5;
            for(let i = 0; i < 3; i++) {
                messenger.spawnParticleOverComb(this._comb, {
                    frame: 1,
                    velocity: new THREE.Vector3(0, 0.1, 0),
                    opacity: 1,
                    size: 0.3,
                    fadeRate: 0.001,
                    color: 0x7f0000,
                    blending: THREE.AdditiveBlending,
                });
            }
            this._tapTimer = 1500;
        }
    }

    onShrink = this.onGrow;

    onDie = () => {
        this._combSprite.remove(this._tapSprite);
    }

}

export default StatusTapped;