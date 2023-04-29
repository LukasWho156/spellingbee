import { Game, THREE } from "luthe-amp";
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";

const StatusFire = {
    apply: (comb, sprite) => {
        return new Fire(comb, sprite);
    }
}

class Fire {

    _comb;
    _combSprite;
    _fireSprite;

    constructor(comb, combSprite) {
        this._comb = comb;
        this._combSprite = combSprite;
        this._fireSprite = new Sprite2D({
            texture: 'combIcons',
            z: 2,
        });
        this._fireSprite.setFrame(18);
        this._flameSprite = new Sprite2D({
            texture: 'combIcons',
            z: 3,
        });
        this._flameSprite.setFrame(18);
        this._flameSprite.material.blending = THREE.AdditiveBlending;
        this._lastSpawn = 0;
    }

    onApply = () => {
        this._fireSprite.scale.set(0, 0, 1);
        this._combSprite.add(this._fireSprite);
        this._comb.ageRate *= 5;
    }

    onGrow = (percentage) => {
        this._fireSprite.material.opacity = percentage * 0.6;
        this._fireSprite.scale.set(percentage, percentage, 1);
        this._flameSprite.material.opacity = percentage * 0.4;
        this._flameSprite.scale.set(percentage, percentage, 1);
    }

    onUpdate = (delta, globalTime, messenger) => {
        this._flameSprite.material.opacity = 0.4 + 0.1 * Math.sin(globalTime * 0.001);
        if(globalTime - this._lastSpawn > 200) {
            if(Math.random() < 0.3) {
                messenger.spawnParticleOverComb(this._comb, {
                    frame: 9,
                    velocity: new THREE.Vector3(0, 0.1, 0),
                    opacity: 0.8,
                    size: 0.45,
                    fadeRate: 0.001,
                    color: 0x3f3f3f,
                });
            }
            messenger.spawnParticleOverComb(this._comb, {
                frame: 8,
                opacity: 1,
                size: 0.3,
                fadeRate: 0.001,
                color: 0x7f3f00,
                blending: THREE.AdditiveBlending,
            });
            messenger.spawnParticleOverComb(this._comb, {
                frame: 8,
                opacity: 1,
                size: 0.3,
                fadeRate: 0.001,
                color: 0x7f3f00,
                blending: THREE.AdditiveBlending,
            });
            this._lastSpawn = globalTime;
        }
    }

    onShrink = this.onGrow;

    onDie = () => {
        this._combSprite.remove(this._fireSprite);
    }

    onAccept = (messenger) => {
        messenger.dealDamageToPlayer(5, true);
        Game.audio.playSound('sfxMonsterAttack');
    }

}

export default StatusFire;