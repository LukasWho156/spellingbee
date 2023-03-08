import { Game, Sprite2D } from "luthe-amp";

const StatusWebbed = {
    apply: (comb, sprite) => {
        return new Webbed(comb, sprite);
    }
}

class Webbed {

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
    }

    onApply = () => {
        this._webSprite.scale.set(0, 0, 1);
        this._combSprite.add(this._webSprite);
    }

    onGrow = (percentage) => {
        this._webSprite.material.opacity = percentage * 0.7;
        this._webSprite.scale.set(percentage, percentage, 1);
    }

    onShrink = this.onGrow;

    onDie = () => {
        this._combSprite.remove(this._webSprite);
    }

    beforeAccept = (messenger) => {
        this._comb.state = 'ready';
        messenger.removeStatusFromComb(this._comb, StatusWebbed);
    }

}

export default StatusWebbed;