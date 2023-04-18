import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";

const StatusDiluted = {
    apply: (comb, sprite) => {
        return new Diluted(comb, sprite);
    }
}

class Diluted {

    _comb;
    _combSprite;
    _scratchSprite;

    constructor(comb, combSprite) {
        this._comb = comb;
        this._combSprite = combSprite;
        this._scratchSprite = new Sprite2D({
            texture: 'combIcons',
            z: 2,
        });
        this._scratchSprite.setFrame(8);
    }

    onApply = () => {
        this._scratchSprite.scale.set(0, 0, 1);
        this._combSprite.add(this._scratchSprite);
        this._comb.damage = this._comb.damage * 0.4;
    }

    onGrow = (percentage) => {
        this._scratchSprite.material.opacity = percentage * 0.7;
        this._scratchSprite.scale.set(percentage, percentage, 1);
    }

    onShrink = this.onGrow;

    onDie = () => {
        this._combSprite.remove(this._scratchSprite);
        this._comb.damage = this._comb.damage / 0.4;
    }

}

export default StatusDiluted;