import { THREE } from "luthe-amp";
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";

const StatusDiluted = {
    apply: (comb, sprite) => {
        return new Diluted(comb, sprite);
    }
}

class Diluted {

    _comb;
    _combSprite;
    _waterSprite;

    constructor(comb, combSprite) {
        this._comb = comb;
        this._combSprite = combSprite;
        this._waterSprite = new Sprite2D({
            texture: 'combIcons',
            z: 2,
        });
        this._waterSprite.setFrame(15);
    }

    onApply = () => {
        this._waterSprite.scale.set(0, 0, 1);
        this._combSprite.add(this._waterSprite);
        this._comb.damage = this._comb.damage * 0.4;
    }

    onGrow = (percentage) => {
        this._waterSprite.material.opacity = percentage * 0.7;
        this._waterSprite.scale.set(percentage, percentage, 1);
    }

    onUpdate = (delta, globalTime, messenger) => {
        if(Math.random() < 0.02) {
            messenger.spawnParticleOverComb(this._comb, {
                frame: 10,
                opacity: 1,
                size: 0.01,
                fadeRate: 0.001,
                growthRate: 0.001,
                color: 0xffffff,
                //blending: THREE.AdditiveBlending,
            });
        }
    }

    onShrink = this.onGrow;

    onDie = () => {
        this._combSprite.remove(this._waterSprite);
        this._comb.damage = this._comb.damage / 0.4;
    }

}

export default StatusDiluted;