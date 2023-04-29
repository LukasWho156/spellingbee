import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";

const StatusFrozen = {
    apply: (comb, sprite) => {
        return new Frozen(comb, sprite);
    }
}

class Frozen {

    _comb;
    _combSprite;
    _iceSprite;

    constructor(comb, combSprite) {
        this._comb = comb;
        this._combSprite = combSprite;
        this._iceSprite = new Sprite2D({
            texture: 'combIcons',
            z: 2,
        });
        this._iceSprite.setFrame(20);
        this._freezeTimer = 5_000;
    }

    onApply = () => {
        this._comb.frozen = true;
        this._iceSprite.scale.set(0, 0, 1);
        this._combSprite.add(this._iceSprite);
    }

    onGrow = (percentage) => {
        this._iceSprite.material.opacity = percentage * 0.7;
        this._iceSprite.scale.set(percentage, percentage, 1);
    }

    onShrink = this.onGrow;

    onUpdate = (delta, globalTime, messenger) => {
        this._freezeTimer -= delta;
        if(this._freezeTimer < 0) {
            messenger.removeStatusFromComb(this._comb, StatusFrozen);
        }
        if(Math.random() < 0.02) {
            messenger.spawnParticleOverComb(this._comb, {
                frame: 2,
                opacity: 1,
                size: 0.2 + Math.random() * 0.2,
                fadeRate: 0.001,
                rotation: Math.random() * Math.PI,
                color: 0xffffff,
                //blending: THREE.AdditiveBlending,
            });
        }
    }

    onDie = () => {
        this._comb.frozen = false;
        this._combSprite.remove(this._iceSprite);
    }

}

export default StatusFrozen;