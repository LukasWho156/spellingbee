import { THREE, Game } from "luthe-amp";
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";
import Gauge from "../../util/gauge.js";

const BOMB_TIME = 10_000;

const StatusBomb = {
    apply: (comb, sprite) => {
        return new Bomb(comb, sprite);
    }
}

class Bomb {

    _comb;
    _combSprite;
    _dynamiteSprite;
    _countdownGauge;
    _rotation;
    _bombTimer;

    constructor(comb, combSprite) {
        this._comb = comb;
        this._combSprite = combSprite;
        this._dynamiteSprite = new Sprite2D({
            texture: Game.getTexture('combIcons'),
            z: 2,
        });
        this._dynamiteSprite.setFrame(17);
        this._countdownGauge = new Gauge('ring', 1, 1, 'ccw');
        this._countdownGauge.position.z = 1;
        this._countdownGauge.scale.set(0.9, 0.9, 1);
        this._rotation = 0;
        this._bombTimer = BOMB_TIME;
        this._particleTimer = 50;
    }

    onApply = () => {
        this._dynamiteSprite.scale.set(1.2, 1.2, 1);
        this._dynamiteSprite.material.opacity = 0;
        this._combSprite.add(this._dynamiteSprite);
        this._dynamiteSprite.scale.set(0, 0, 1);
        this._combSprite.add(this._countdownGauge);
        this._countdownGauge.visible = false;
    }

    onGrow = (percentage) => {
        this._dynamiteSprite.material.opacity = percentage;
        this._dynamiteSprite.scale.set(percentage, percentage, 1);
    }

    onUpdate = (delta, globalTime, messenger) => {
        this._particleTimer -= delta;
        if(this._particleTimer <= 0) {
            this._particleTimer = 50;
            const x = this._comb.rX - 40;
            const y = this._comb.rY - 300 + 50 * this._bombTimer / BOMB_TIME;
            messenger.particleSystem.spawn(6, {
                position: new THREE.Vector3(x, y, 75),
                velocity: new THREE.Vector3(Math.random() * 0.4 - 0.2, Math.random() * 0.4, 0),
                acceleration: new THREE.Vector3(0, -0.001, 0),
                color: 0xff7f00,
                opacity: 0.7,
                size: 0.25,
                fadeRate: 0.001,
                blending: THREE.AdditiveBlending,
            })
        }
        this._bombTimer -= delta;
        this._countdownGauge.visible = true;
        this._countdownGauge.setValue(this._bombTimer / BOMB_TIME);
        const color = 0xff0000 + (Math.floor(this._bombTimer / BOMB_TIME * 255) << 8);
        this._countdownGauge.setColor(color);
        const scale = 1 + 0.1 * Math.sin(globalTime * 0.005)
        this._dynamiteSprite.scale.set(scale, scale, 1);
        if(this._bombTimer < 0) {
            messenger.dealDamageToPlayer(10, true);
            messenger.removeStatusFromComb(this._comb, StatusBomb);
            this._comb.state = 'rotten';
            Game.audio.playSound('sfxExplosion');
        }
    }

    onShrink = this.onGrow;

    onDie = () => {
        this._combSprite.remove(this._dynamiteSprite);
        this._combSprite.remove(this._countdownGauge);
    }

}

export default StatusBomb;