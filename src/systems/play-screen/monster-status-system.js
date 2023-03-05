import { THREE, Game, Sprite2D } from "luthe-amp";
import MonsterStatusComponent from "./monster-status-component.js";
import createGauge from "../../util/gauge.js";

class MonsterStatusSystem {

    _messenger;
    _statuses;
    _gaugeGroup;

    get gaugeGroup() {
        return this._gaugeGroup;
    }

    constructor(messenger) {
        this._statuses = [];
        this._messenger = messenger;
        this._gaugeGroup = new THREE.Group();
        messenger.applyStatusToMonster = (status, time) => this.applyStatus(status, time);
        messenger.calculateMonsterDamage = (damage, wordLength) => {
            return this._statuses.reduce((prev, status) => status.component.onDamageCalculation(prev, wordLength), damage);
        }
        messenger.triggerMonsterAttacked = () => {
            this._statuses.forEach(status => {
                status.component.onAttacked()
            });    
        }
    }

    applyStatus = (status, time) => {
        if(!this._messenger.getCurrentMonster()) {
            return;
        }
        const existing = this._statuses.find(s => s.status === status);
        if(existing) {
            existing.component.addTime(time);
            return;
        }
        const component = new MonsterStatusComponent(status.apply(), time, this._messenger);
        component.onApply();
        const gauge = createGauge('ring', 75, 75, 'ccw');
        gauge.setColor(status.color);
        const intent = new Sprite2D({
            texture: Game.getTexture('intents'),
            framesX: 4,
            framesY: 2,
            scaleX: 0.15,
            scaleY: 0.15,
        });
        intent.setFrame(status.intent ?? 0)
        gauge.add(intent);
        this._gaugeGroup.add(gauge);
        this._statuses.push({status: status, component: component, gauge: gauge});
        this._repositionGauges();
    }

    cleanse = () => {
        this._statuses = [];
        while(this._gaugeGroup.children.length) {
            this._gaugeGroup.remove(this._gaugeGroup.children[0]);
        }
    }

    update = (delta, globalTime) => {
        this._statuses.forEach(status => {
            status.component.update(delta, globalTime);
            status.gauge.setValue(status.component.value);
        })
        let reposition = false;
        this._statuses = this._statuses.filter(status => {
            if(status.component.isDead) {
                this._gaugeGroup.remove(status.gauge);
                reposition = true;
                return false;
            }
            return true;
        });
        if(reposition) this._repositionGauges();
    }

    _repositionGauges = () => {
        this._statuses.forEach((status, i) => {
            status.gauge.position.set(0, i * 80, 0);
        })
    }

}

export default MonsterStatusSystem