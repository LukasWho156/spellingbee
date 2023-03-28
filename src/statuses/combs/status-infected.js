import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";

const SPREADING_TIME = 7_500;

const StatusInfected = {
    apply: (comb, sprite) => {
        return new Infected(comb, sprite);
    }
}

class Infected {

    _comb;
    _combSprite;
    _slimeSprite;
    _spreadTimer;

    constructor(comb, combSprite) {
        this._comb = comb;
        this._combSprite = combSprite;
        this._slimeSprite = new Sprite2D({
            texture: 'combIcons',
            z: 2,
        });
        this._slimeSprite.setFrame(14);
        this._spreadTimer = SPREADING_TIME;
    }

    onApply = () => {
        this._slimeSprite.scale.set(0, 0, 1);
        this._combSprite.add(this._slimeSprite);
        //this._comb.damage = this._comb.damage * 0.6;
    }

    onGrow = (percentage) => {
        this._slimeSprite.material.opacity = percentage * 0.7;
        this._slimeSprite.scale.set(percentage, percentage, 1);
    }

    onUpdate = (delta, globalTime, messenger) => {
        this._spreadTimer -= delta;
        if(this._spreadTimer < 0) {
            this._spreadTimer = SPREADING_TIME;
            const neighbour = messenger.getRandomNeighbour(this._comb);
            if(neighbour) messenger.applyStatusToComb(neighbour, StatusInfected);
        }
    }

    onShrink = this.onGrow;

    onDie = () => {
        this._combSprite.remove(this._slimeSprite);
        this._comb.damage = this._comb.damage / 0.4;
    }

}

export default StatusInfected;