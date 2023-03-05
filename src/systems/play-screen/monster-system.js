import { THREE, Game, SimpleSystem, Sprite2D } from "luthe-amp";
import { Text } from "troika-three-text";
import createGauge from "../../util/gauge.js";
import AttackComponent from "./attack-component.js";
import BopComponent from "./bop-component.js";
import DamagedComponent from "./damaged-component.js";
import GrowthComponent from "./growth-component.js";
import MonsterStatusSystem from "./monster-status-system.js";

const DROP_ACCELERATION = new THREE.Vector3(0, -0.0075, 0);

class MonsterSystem {

    _scene;
    _currentMonster;

    _internalSystem;
    _particleSystem;
    _statusSystem;

    _messenger;

    _currentAttack;
    _timer;

    _uiGroup;
    _timerGauge;
    _healthbar;
    _healthText;

    get isAlive() {
        return this._currentMonster?.health > 0;
    }

    constructor(scene, particleSystem, messenger) {
        this._scene = scene;
        this._internalSystem = new SimpleSystem();
        this._particleSystem = particleSystem;
        this._statusSystem = new MonsterStatusSystem(messenger);
        
        this._messenger = messenger;
        this._messenger.dealDamageToMonster = (damage) => this.dealDamage(damage);
        this._messenger.getCurrentMonster = () => this._currentMonster;
    }

    mount = () => {
        this._uiGroup = new THREE.Group();
        this._timerGauge = createGauge('ring', 100, 100, 'ccw');
        this._timerGauge.position.set(217, 130);
        this._intent = new Sprite2D({
            texture: Game.getTexture('intents'),
            framesX: 4,
            framesY: 2,
            scaleX: 0.2,
            scaleY: 0.2,
        });
        this._timerGauge.add(this._intent);
        this._uiGroup.add(this._timerGauge);
        this._healthbar = createGauge('healthbar', 400, 40, 'h', [0.01, 0.99]);
        this._healthbar.setValue(1);
        this._healthbar.position.y = 100;
        this._healthbar.position.x = -67;
        this._healthText = new Text();
        this._healthText.font = Game.font;
        this._healthText.position.z = 5
        this._healthText.color = 0xffffff;
        this._healthText.fontSize = 20;
        this._healthText.anchorX = 'center';
        this._healthText.anchorY = '52%';
        this._healthbar.add(this._healthText);
        this._uiGroup.add(this._healthbar);
        this._statusSystem.gaugeGroup.position.set(217, 230);
        this._uiGroup.add(this._statusSystem.gaugeGroup);
        this._scene.add(this._uiGroup);
        //this._spawnMonster(DungBeetle);
    }

    _startAttack = () => {
        this._currentAttack = this._currentMonster.nextAttack(this._currentMonster.attackIndex, this._currentMonster.history);
        this._timerGauge.setColor(this._currentAttack.color);
        this._currentMonster.attackIndex++;
        this._currentMonster.history.push(this._currentAttack.id);
        this._timer = this._currentAttack.windupTime;
        this._intent.setFrame(this._currentAttack.intent);
    }

    spawnMonster = (monster) => {
        const sprite = new Sprite2D({
            texture: Game.getTexture(monster.texture),
            handle: 'bottom',
            x: -67,
            y: -125,
            scaleX: 0,
            scaleY: 0,
        });
        this._scene.add(sprite);
        this._currentMonster = {
            size: 0,
            fullSize: 1,
            state: 'growing',
            bopFrequency: 0.0003,
            bopOffset: 0,
            bopX: 0.05,
            bopY: 0.05,
            health: monster.health,
            maxHealth: monster.health,
            hurt: 0,
            attacked: 0,
            nextAttack: monster.nextAttack,
            history: [],
            attackIndex: 0,
            speedBonus: monster.speedBonus ?? 1,
            sprite: sprite,
        };
        this._internalSystem.add(new GrowthComponent(this._currentMonster, sprite));
        this._internalSystem.add(new BopComponent(this._currentMonster, sprite));
        this._internalSystem.add(new DamagedComponent(this._currentMonster, sprite));
        this._internalSystem.add(new AttackComponent(this._currentMonster, sprite));
        this._healthbar.setValue(1);
        this._healthText.text = `${this._currentMonster.health} / ${this._currentMonster.maxHealth}`;
        this._startAttack();
    }

    dealDamage = (damage) => {
        if(!this._currentMonster) return;
        damage = this._messenger.calculateMonsterDamage(damage);
        damage = Math.floor(damage);
        this._currentMonster.health -= damage;
        if(this._currentMonster.health < 0) {
            this._currentMonster.health = 0;
        }
        this._healthbar.setValue(this._currentMonster.health / this._currentMonster.maxHealth);
        this._healthText.text = `${this._currentMonster.health} / ${this._currentMonster.maxHealth}`;
        this._currentMonster.hurt = 1;
        if(this._currentMonster.health <= 0) {
            this._die();
        }
    }

    _die = () => {
        this._dropVelocity = new THREE.Vector3(-1, 0, 0);
        this._dropSprite = this._currentMonster.sprite;
        this._dropSpin = 0;
        this._currentMonster = null;
        this._statusSystem.cleanse();
    }

    update = (delta, globalTime) => {
        this._internalSystem.update(delta, globalTime);
        if(!this._messenger.isPaused()) this._statusSystem.update(delta, globalTime);
        if(this._dropSprite) {
            this._dropSprite.position.add(this._dropVelocity.clone().multiplyScalar(delta));
            //this._dropVelocity.add(DROP_ACCELERATION.clone().multiplyScalar(delta));
            this._dropSprite.material.opacity -= 0.003 * delta;
            this._dropSpin -= 0.005 * delta;
            //this._dropSprite.setRotation(this._dropSpin);
            if(this._dropSprite.material.opacity <= 0) {
                this._scene.remove(this._dropSprite);
                this._dropSprite = null;
            }
        }
        const ready = (this._currentMonster?.state === 'ready')
        this._uiGroup.visible = ready;
        this._intent.setRotation(0.2 * Math.cos(0.001 * globalTime))
        this._intent.setScale(0.2 - 0.02 * Math.sin(0.001 * globalTime));
        if(this._currentAttack && !this._messenger.isPaused()) {
            this._timerGauge.setValue(this._timer / this._currentAttack.windupTime);
        }
        if(ready && !this._messenger.isPaused()) {
            this._timer -= delta * this._currentMonster.speedBonus;
            if(this._timer < 0) {
                this._currentMonster.attacked = 1;
                this._currentAttack.action(this._messenger);
                this._startAttack();
            }
        }
    }

}

export default MonsterSystem;