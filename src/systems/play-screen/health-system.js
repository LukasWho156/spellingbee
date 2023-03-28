import { Game } from "luthe-amp";
import { Text } from "troika-three-text";
import createGauge from "../../util/gauge.js";

const DECAY_RATE = 0.02;

class HealthSystem {

    _scene;
    _healthbar;
    _healthText;
    _health;
    _maxHealth;
    _bloodPass;
    _bloodIntensity;
    _messenger;

    get health() {
        return this._health;
    }

    constructor(scene, health, maxHealth, bloodPass, messenger) {
        this._scene = scene;
        this._health = health;
        this._maxHealth = maxHealth;
        this._bloodPass = bloodPass;
        this._bloodIntensity = 0;
        if(messenger) {
            messenger.dealDamageToPlayer = (damage, piercing) => this.dealDamage(damage, piercing);
            messenger.healPlayer = (healthAmount) => this.heal(healthAmount);
            this._messenger = messenger;
        }
    }

    dealDamage = (damage, piercing) => {
        const dmg = { value: damage }
        if(!piercing && this._messenger) {
            this._messenger.triggerPlayerAttacked(dmg);
            this._messenger.triggerFlowerDamagePlayer(dmg);
        }
        this._health -= Math.floor(dmg.value);
        if(this._health < 0) this._health = 0;
        const value = this._health / this._maxHealth;
        this._bloodIntensity = 1 - 0.75 * value;
        this._updateHealthBar();
    } 

    heal = (healthAmount) => {
        this._health += healthAmount;
        if(this._health > this._maxHealth) this._health = this._maxHealth;
        this._updateHealthBar();
    }

    setHealth = (health) => {
        this._health = health;
        this._updateHealthBar();
    }

    mount = () => {
        if(this._healthbar) return;
        this._healthbar = createGauge('honeyBar', 520, 96, 'h', [0.015, 0.955]);
        this._healthbar.setValue(1);
        this._healthbar.position.y = 600 - 96 / 2;
        this._healthbar.position.x = -40;
        this._healthText = new Text();
        this._healthText.font = Game.font;
        this._healthText.position.z = 5
        this._healthText.color = 0x000000;
        this._healthText.fontSize = 30;
        this._healthText.anchorX = 'center';
        this._healthText.anchorY = '65%';
        this._healthText.text = `${this._health} / ${this._maxHealth}`;
        this._healthbar.add(this._healthText);
        this._updateHealthBar();
        this._scene.add(this._healthbar)
    }

    update = (delta) => {
        if(!this._bloodPass) return;
        this._bloodIntensity *= (1 - DECAY_RATE);
        this._bloodPass.setUniform('intensity', this._bloodIntensity);
    }

    _updateHealthBar = () => {
        const value = this._health / this._maxHealth;
        this._healthbar.setValue(value);
        this._healthText.text = `${this._health} / ${this._maxHealth}`;
        this._healthText.sync();
    }

}

export default HealthSystem;