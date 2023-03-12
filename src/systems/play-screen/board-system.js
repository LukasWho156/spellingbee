import { THREE, Game, SimpleSystem } from 'luthe-amp';
import { Sprite2D } from 'luthe-amp/lib/graphics/utility/sprite-2d';
import { Text } from 'troika-three-text';

import GrowthComponent from './growth-component.js';
import AgeComponent from './age-component.js';
import { getRandomLetter } from '../../language/get-random-letter.js';
import createGauge from '../../util/gauge.js';
import getRandomBuff from '../../statuses/combs/get-random-buff.js';
import HintSystem from './hint-system.js';

const INTERACTION_DIST = 2500;
const REROLL_DAMAGE = 50;

const honeycombToReal = (x, y) => {
    return {
        x: x * 0.75 * 127,
        y: y * Math.sqrt(3) / 4 * 254,
    }
}

class BoardSystem extends EventTarget {

    _offset;
    _board;
    _combs;
    _chain;

    _internalSystem;
    _restockSystem;
    _particleSystem;
    
    _messenger;

    _rerollHeld;
    _rerollTimer;

    _jokerOnBoard;

    _baseBuffProbability = -0.1;
    _buffIncrease = 0.04;

    _hintSystem;

    get board() {
        return this._board;
    }

    get combs() {
        return this._combs;
    }

    get chain() {
        return this._chain;
    }

    get selectedWord() {
        return this._chain.reduce((prev, cur) => prev + cur.letter, '').toUpperCase();
    }

    get lastSelected() {
        if(this._chain.length < 1) return null;
        return this._chain[this._chain.length - 1];
    }

    get penultimateSelected() {
        if(this._chain.length < 2) return null;
        return this._chain[this._chain.length - 2];
    }

    get restockSystem() {
        return this._restockSystem;
    }

    constructor(position, particleSystem, messenger)  {
        super();

        this._offset = new THREE.Vector2(-300, -300);
        this._combs = [];
        this._chain = [];

        this._board = new THREE.Group();
        this._board.position.copy(position);

        this._internalSystem = new SimpleSystem();
        this._restockSystem = new SimpleSystem();
        this._particleSystem = particleSystem;
        this._messenger = messenger;

        messenger.getRandomCombs = (amount) => this.getRandomCombs(amount);
        messenger.getRandomNeighbour = (comb) => this._getNeighbour(comb);
        messenger.deselectAll = () => this.deselectAll();
        messenger.spawnParticleOverComb = (comb, particle) => this._spawnParticleOverComb(comb, particle);
    }

    mouseToBoard = (mX, mY) => {
        return {
            x: mX + this._offset.x,
            y: Game.height - mY + this._offset.y,
        }
    }

    findComb = (x, y) => {
        for(const comb of this._combs) {
            if(comb.state !== 'ready' && comb.state !== 'selected') continue;
            const distSquared = (x- comb.rX) * (x - comb.rX) + (y - comb.rY) * (y - comb.rY);
            if(distSquared <= INTERACTION_DIST){
                return comb;
            }
        }
        return null;
    }

    selectComb = (comb) => {
        comb.state = 'selected',
        this._chain.push(comb);
        this._updateChain();
    }

    deselectAll = () => {
        for(const comb of this._chain) {
            if(comb.state === 'selected') comb.state = 'ready';
        }
        this._chain = [];
        this._updateChain();
    }

    popAll = () => {
        for(const comb of this._combs) {
            comb.state = 'rotten';
        }
    }

    acceptWord = () => {
        this._chain.forEach(comb => {
            comb.state = 'accepted';
        });
    }

    deselectLatest = () => {
        const lastComb = this._chain.pop();
        lastComb.state = 'ready';
        this._updateChain();
    }

    getRandomCombs = (amount) => {
        const combsCopy = [...this._combs];
        const result = [];
        for(let i = 0; i < amount; i++) {
            const rnd = Math.floor(Math.random() * combsCopy.length);
            result.push(combsCopy[rnd]);
            combsCopy.splice(rnd, 1);
        }
        return result;
    }

    _getNeighbour = (comb) => {
        const neighbours = this._combs.filter(c2 => {
            if(comb.x === c2.x && comb.y === c2.y) return false;
            if(Math.abs(comb.x - c2.x) > 1) return false;
            if(Math.abs(comb.y - c2.y) > 1) return false;
            return true;
        });
        return neighbours[Math.floor(Math.random() * neighbours.length)];
    }

    startRerollTimer = () => {
        this._rerollHeld = true;
        this._rerollTimer = 0;
        this._rerollGauge.visible = true;
    }

    stopRerollTimer = () => {
        this._rerollHeld = false;
        this._rerollTimer = 0;
        this._rerollGauge.visible = false;
    }

    _spawnComb = (x, y, letter) => {
        const real = honeycombToReal(x, y);
        letter ??= getRandomLetter();
        const sprite = new Sprite2D({
            texture: Game.getTexture('honeycomb'),
            framesX: 2,
            framesY: 2,
            scaleX: 0,
            scaleY: 0,
            x: real.x,
            y: -real.y,
            z: 10,
        });
        const entity = {
            damage: 5,
            letter: letter,
            x: x,
            y: y,
            rX: real.x,
            rY: real.y,
            state: 'growing',
            fullScale: 0.5,
            size: 0,
            age: 0,
            ageStage: 0,
            ageRate: 0.95 + Math.random() * 0.1,
            sprite: sprite,
            statuses: [],
        };
        if(Math.random() < this._buffProbablility) {
            if(Math.random() < 0.2 && !this._jokerOnBoard) {
                entity.letter = '*';
                this._jokerOnBoard = true;
            } else {
                this._messenger.applyStatusToComb(entity, getRandomBuff());
            }
            this._buffProbablility = this._baseBuffProbability;
        } else {
            this._buffProbablility += this._buffIncrease;
        }
        if(entity.letter === '*') {
            const text = new Sprite2D({texture: 'combIcons'});
            text.setFrame(2);
            text.scale.set(0.9, 0.9, 1);
            text.position.y = 0.02;
            text.position.z = 5;
            sprite.add(text);
        } else {
            const text = new Text();
            text.font = Game.font;
            text.text = entity.letter;
            text.color = 0x000000;
            text.fontSize = 0.5;
            text.anchorX = 'center';
            text.anchorY = '52%';
            text.sync();
            text.position.z = 5;
            sprite.add(text);
        }
        const shadow = new Sprite2D({texture: Game.getTexture('shadow')});
        shadow.position.y = -0.05;
        shadow.position.z = -5;
        shadow.scale.set(1.6, 1.6, 0);
        shadow.material.color.set(0x3f1f00);
        shadow.material.opacity = 0.7;
        sprite.add(shadow);
        this._combs.push(entity);
        this._internalSystem.add(new GrowthComponent(entity, sprite));
        this._internalSystem.add(new AgeComponent(entity, sprite, this._messenger));
        this._restockSystem.add({
            update: () => {
                if(entity.state === 'rotten' || entity.state === 'accepted') {
                    if(this._hintSystem && entity.state === 'accepted') {
                        this._hintSystem.triggerWordFound();
                    }
                    if(!!this._chain.find(e => e === entity)) {
                        this.deselectAll();
                    }
                    this._popComb(entity, entity.state === 'accepted');
                    this._board.remove(sprite);
                }
            }
        })
        this._board.add(sprite);
        if(this._hintSystem) this._hintSystem.triggerReload();
    }

    _popComb = (comb, success) => {
        comb.state = 'removed';
        if(comb.letter === '*') {
            this._jokerOnBoard = false;
        }
        this._combs.splice(this._combs.findIndex(c => c === comb), 1);
        this._spawnComb(comb.x, comb.y, comb.replacement);
        for(let i = 0; i < 3; i++) {
            const particle = success ? {
                frame: 0,
                velocity: new THREE.Vector3(0, 0.5, 0),
                opacity: 1,
                size: Math.random() * 0.5 + 0.25,
                fadeRate: 0.001,
                rotation: Math.random() * Math.PI,
                spin: (Math.random() - 0.5) * Math.PI * 0.01,
                color: 0x003f7f,
                blending: THREE.AdditiveBlending,
            } : {
                frame: 0,
                velocity: new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.5, 0),
                acceleration: new THREE.Vector3(0, -0.002, 0),
                opacity: 1,
                size: Math.random() * 0.5 + 0.25,
                fadeRate: 0.001,
                rotation: Math.random() * Math.PI,
                spin: (Math.random() - 0.5) * Math.PI * 0.01,
                color: 0x7f3f00,
                blending: THREE.AdditiveBlending,
            }
            this._spawnParticleOverComb(comb, particle);
        }
    }

    _spawnParticleOverComb = (comb, particle) => {
        const dist = Math.random() * 50;
        const angle = Math.random() * Math.PI * 2;
        const position = new THREE.Vector3(comb.rX + dist * Math.cos(angle), comb.rY + dist * Math.sin(angle), 50).add(this._board.position);
        this._particleSystem.spawn(particle.frame, {
            position: position,
            ...particle,
        });
    }

    _updateChain = () => {
        this.dispatchEvent(new CustomEvent('selectionchanged'));
    }

    mount = () => {
        this._rerollGauge = createGauge('ring', 450, 450, 'cw');
        this._rerollGauge.setColor(0xffaf3f);
        this._rerollGauge.visible = false;
        this._rerollGauge.position.z = 50;
        this._board.add(this._rerollGauge);
        for(let x = -2; x <= 2; x++) {
            for(let y = -2 + Math.abs(x) / 2; y <= 2 - Math.abs(x) / 2; y++) {
                this._spawnComb(x, y);
            }
        }
        this._buffProbablility = this._baseBuffProbability;
        const chance = {value: this._buffIncrease};
        this._messenger.triggerFlowerBuffChance(chance);
        this._buffIncrease = chance.value;
        this._jokerOnBoard = false;
        if(this._messenger.triggerFlowerHints()) {
            this._hintSystem = HintSystem(this._combs, this._messenger, 20000);
            this._hintSystem.triggerReload();
        }
    }

    update = (delta, globalTime) => {
        this._internalSystem.update(delta, globalTime);
        if(this._messenger.isPaused()) return;
        if(this._rerollHeld) {
            this._rerollTimer += delta;
            this._rerollGauge.setValue(this._rerollTimer / 1000);
            if(this._rerollTimer >= 1000) {
                this.popAll();
                this._messenger.dealDamageToPlayer(REROLL_DAMAGE, true);
                this.stopRerollTimer();
            }
        }
        if(this._hintSystem) this._hintSystem.update(delta);
    }

}

export default BoardSystem;