import { Game } from "luthe-amp";
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";
import { MouseInteractionComponent } from "luthe-amp/lib/input/mouse-interaction-component";

import Gauge from "./gauge.js";

class Slider extends EventTarget {

    _sprite;
    _knob;
    _value;
    _width;

    get sprite() {
        return this._sprite;
    }

    constructor(mis, width, height, initialValue) {
        super();
        this._width = width;
        this._sprite = new Gauge('healthbar', width, height, 'h');
        this._sprite.position.z = 5;
        this._knob = new Sprite2D({
            texture: 'honeycomb',
            framesX: 2,
            framesY: 2,
            scaleX: 0.2,
            scaleY: 0.2,
            z: 10,
        });
        this._sprite.add(this._knob);
        this.setValue(initialValue);
        const barInteraction = new MouseInteractionComponent({}, this._sprite);
        mis.add(barInteraction);
        barInteraction.addEventListener('dragstart', (event) => {
            Game.audio.playSound('sfxClick');
            this.setValue(Math.min(1, Math.max(0, (event.detail.x - 0.5 * (Game.width - width)) / width)));
        })
        barInteraction.addEventListener('dragmove', (event) => {
            this.setValue(Math.min(1, Math.max(0, (event.detail.x - 0.5 * (Game.width - width)) / width)));
        })
        const knobInteraction = new MouseInteractionComponent({ cursor: 'pointer' }, this._knob);
        mis.add(knobInteraction);
        knobInteraction.addEventListener('dragstart', (event) => {
            Game.audio.playSound('sfxClick');
            this.setValue(Math.min(1, Math.max(0, (event.detail.x - 0.5 * (Game.width - width)) / width)));
        })
        knobInteraction.addEventListener('dragmove', (event) => {
            this.setValue(Math.min(1, Math.max(0, (event.detail.x - 0.5 * (Game.width - width)) / width)));
        })
    }

    setValue = (value) => {
        this._sprite.setValue(value);
        this._knob.position.x = (value - 0.5) * this._width;
        this.dispatchEvent(new CustomEvent('valuechanged', {detail: {value: value}}));
    }

}

export default Slider;