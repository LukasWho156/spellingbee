import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";

const StatusTarget = {
    apply: (comb, sprite) => {
        return new Target(comb, sprite);
    }
}

class Target {

    _comb;
    _combSprite;
    _targetSprite

    constructor(comb, combSprite) {
        this._comb = comb;
        this._combSprite = combSprite;
        this._targetSprite = new Sprite2D({
            texture: 'combIcons',
            z: 2,
        });
        this._targetSprite.setFrame(19);
    }

    onApply = () => {
        this._targetSprite.scale.set(0, 0, 1);
        this._combSprite.add(this._targetSprite);
    }

    onGrow = (percentage) => {
        this._targetSprite.material.opacity = percentage * 0.7;
        this._targetSprite.scale.set(percentage, percentage, 1);
    }

    onShrink = this.onGrow;

    onDie = () => {
        this._combSprite.remove(this._targetSprite);
    }

}

export default StatusTarget;