import { THREE, Game, Sprite2D } from "luthe-amp";

class Buff {

    _comb;
    _combSprite;
    _shadowSprite;
    _lastSpawn;
    _onApply;

    constructor(comb, combSprite, color, particle, onAccept, onApply) {
        this._comb = comb;
        this._combSprite = combSprite;
        this._shadowSprite = new Sprite2D({
            texture: Game.getTexture('shadow'),
            z: 2,
        })
        this._color = color;
        this._particle = particle;
        this.onAccept = onAccept;
        this._onApply = onApply ?? (() => {});
    }

    onApply = () => {
        this._shadowSprite.scale.set(1.2, 1.2, 1);
        this._shadowSprite.material.opacity = 0.3;
        this._shadowSprite.material.color.set(this._color);
        this._shadowSprite.material.blending = THREE.AdditiveBlending;
        this._combSprite.add(this._shadowSprite);
        this._lastSpawn = 0;
        this._onApply(this._comb);
    }

    onShrink = (percentage) => {
        this._shadowSprite.scale.set(percentage, percentage, 1);
    };

    onUpdate = (delta, globalTime, messenger) => {
        this._shadowSprite.material.opacity = 0.4 + 0.1 * Math.sin(globalTime * 0.001);
        if(globalTime - this._lastSpawn > 300) {
            messenger.spawnParticleOverComb(this._comb, {
                frame: this._particle,
                velocity: new THREE.Vector3(0, 0.1, 0),
                opacity: 1,
                size: 0.3,
                fadeRate: 0.001,
                color: this._color,
                blending: THREE.AdditiveBlending,
            });
            this._lastSpawn = globalTime;
        }
    }

    onDie = () => {
        this._combSprite.remove(this._shadowSprite);
    }
}

export default Buff;