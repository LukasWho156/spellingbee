import { Sprite2D } from "luthe-amp";

const StatusWhirled = {
    apply: (comb, sprite) => {
        return new Whirled(comb, sprite);
    }
}

class Whirled {

    _comb;
    _combSprite;
    _whirlSprite;
    _rotation;
    _spin;

    constructor(comb, combSprite) {
        this._comb = comb;
        this._combSprite = combSprite;
        this._whirlSprite = new Sprite2D({
            texture: 'combIcons',
            z: 2,
        });
        this._whirlSprite.setFrame(11);
        this._rotation = 0;
        this._spin = Math.sign(Math.random() - 0.5) * (Math.random() * 0.001 + 0.001)
    }

    onApply = () => {
        this._whirlSprite.scale.set(0, 0, 1);
        this._combSprite.add(this._whirlSprite);
    }

    onGrow = (percentage) => {
        this._whirlSprite.material.opacity = percentage * 0.6;
        this._whirlSprite.scale.set(percentage, percentage, 1);
    }

    onUpdate = (delta) => {
        this._rotation += this._spin * delta;
        this._whirlSprite.setRotation(this._rotation);
        this._combSprite.rotation.z = this._rotation;
    }

    onShrink = this.onGrow;

    onDie = () => {
        this._combSprite.remove(this._whirlSprite);
    }

}

export default StatusWhirled;