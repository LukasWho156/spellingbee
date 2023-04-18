import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";
import StatusStrength from "../monster/status-strength.js";

const StatusTrapped = {
    apply: (comb, sprite) => {
        return new Trapped(comb, sprite);
    }
}

class Trapped {

    _comb;
    _combSprite;
    _trapSprite

    constructor(comb, combSprite) {
        this._comb = comb;
        this._combSprite = combSprite;
        this._trapSprite = new Sprite2D({
            texture: 'combIcons',
            z: 2,
        });
        this._trapSprite.setFrame(16);
    }

    onApply = () => {
        this._trapSprite.scale.set(0, 0, 1);
        this._combSprite.add(this._trapSprite);
    }

    onGrow = (percentage) => {
        this._trapSprite.material.opacity = percentage * 0.8;
        this._trapSprite.scale.set(percentage, percentage, 1);
    }

    onShrink = this.onGrow;

    onDie = () => {
        this._combSprite.remove(this._trapSprite);
    }

    onAccept = (messenger) => {
        messenger.dealDamageToPlayer(10, true);
        messenger.applyStatusToMonster(StatusStrength, -1, 1);
    }

}

export default StatusTrapped;