import { THREE, Game } from "luthe-amp";
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";
import { Text } from "troika-three-text";

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
        messenger.getStatusStacks = (status) => this.getStacks(status);
        messenger.applyStatusToMonster = (status, time, stacks) => this.applyStatus(status, time, stacks);
        messenger.calculateMonsterDamage = (damage, wordLength) => {
            return this._statuses.reduce((prev, status) => status.component.onDamageCalculation(prev, wordLength), damage);
        }
        messenger.triggerMonsterAttacked = () => {
            this._statuses.forEach(status => {
                status.component.onAttacked()
            });    
        }
        messenger.triggerPlayerAttacked = (damage) => {
            this._statuses.forEach(status => {
                status.component.onAttackPlayer(damage);
            });    
        }
        messenger.triggerMonsterCombSpawned = (comb) => {
            this._statuses.forEach(status => {
                status.component.onCombSpawned(comb);
            });    
        }
    }

    getStacks = (status) => {
        if(!this._messenger.getCurrentMonster()) {
            return 0;
        }
        const existing = this._statuses.find(s => s.status === status);
        console.log(existing, existing?.component.stacks);
        return existing?.component.stacks ?? 0;
    }

    applyStatus = (status, time, stacks) => {
        if(!this._messenger.getCurrentMonster()) {
            return;
        }
        const existing = this._statuses.find(s => s.status === status);
        if(existing) {
            existing.component.addTime(time);
            if(stacks) existing.component.addStacks(stacks);
            if(existing.stackLabel) {
                existing.stackLabel.text = existing.component.stacks;
                existing.stackLabel.sync();
            }
            return;
        }
        const component = new MonsterStatusComponent(status.apply(), time, this._messenger, stacks);
        component.onApply();
        const gauge = createGauge('ring', 75, 75, 'ccw');
        gauge.setColor(status.color);
        const intent = new Sprite2D({
            texture: Game.getTexture('intents'),
            scaleX: 0.15,
            scaleY: 0.15,
        });
        intent.setFrame(status.intent ?? 0)
        gauge.add(intent);
        this._gaugeGroup.add(gauge);
        let stackLabel =null;
        if(stacks) {
            stackLabel = new Text();
            stackLabel.text = component.stacks;
            stackLabel.font = Game.font;
            stackLabel.fontSize = 30;
            stackLabel.anchorX = 'left';
            stackLabel.anchorY = 'bottom';
            stackLabel.color = 0x000000;
            stackLabel.outlineColor = 0xffffff;
            stackLabel.outlineBlur = '100%';
            stackLabel.sync();
            stackLabel.position.set(20, -45, 5);
            gauge.add(stackLabel);
        } 
        this._statuses.push({status: status, component: component, gauge: gauge, stackLabel: stackLabel});
        this._statuses.sort((a, b) => a.status.priority - b.status.priority);
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