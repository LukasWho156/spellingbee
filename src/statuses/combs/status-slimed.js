import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";

const StatusSlimed = {
    apply: (comb, sprite) => {
        return new Slimed(comb, sprite);
    }
}

class Slimed {

    _comb;
    _combSprite;
    _slimeSprite;

    constructor(comb, combSprite) {
        this._comb = comb;
        this._combSprite = combSprite;
        this._slimeSprite = new Sprite2D({
            texture: 'combIcons',
            z: 7,
        });
        this._slimeSprite.setFrame(13);
    }

    onApply = () => {
        this._slimeSprite.scale.set(0, 0, 1);
        this._combSprite.add(this._slimeSprite);
        //this._comb.damage = this._comb.damage * 0.6;
    }

    onGrow = (percentage) => {
        this._slimeSprite.material.opacity = percentage;
        this._slimeSprite.scale.set(percentage, percentage, 1);
    }

    onUpdate = (delta, globalTime, messenger) => {
        this._slimeSprite.material.opacity -= delta * 0.00005;
        if(this._slimeSprite.material.opacity <= 0) {
            messenger.removeStatusFromComb(this._comb, StatusSlimed);
        }
    }

    onShrink = (percentage) => {
        this._slimeSprite.scale.set(percentage, percentage, 1);
    }

    onDie = () => {
        this._combSprite.remove(this._slimeSprite);
    }

}

export default StatusSlimed;