import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";

const StatusFrozen = {
    apply: (comb, sprite) => {
        return new Frozen(comb, sprite);
    }
}

class Frozen {

    _comb;
    _combSprite;
    _webSprite

    constructor(comb, combSprite) {
        this._comb = comb;
        this._combSprite = combSprite;
        this._webSprite = new Sprite2D({
            texture: 'combIcons',
            z: 2,
        });
        this._webSprite.setFrame(9);
        this._freezeTimer = 5_000;
    }

    onApply = () => {
        this._comb.frozen = true;
        this._webSprite.scale.set(0, 0, 1);
        this._combSprite.add(this._webSprite);
    }

    onGrow = (percentage) => {
        this._webSprite.material.opacity = percentage * 0.7;
        this._webSprite.scale.set(percentage, percentage, 1);
    }

    onShrink = this.onGrow;

    onUpdate = (delta, globalTime, messenger) => {
        this._freezeTimer -= delta;
        if(this._freezeTimer < 0) {
            messenger.removeStatusFromComb(this._comb, StatusFrozen);
        }
    }

    onDie = () => {
        this._comb.frozen = false;
        this._combSprite.remove(this._webSprite);
    }

}

export default StatusFrozen;