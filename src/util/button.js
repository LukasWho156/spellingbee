import { THREE, Game } from "luthe-amp";
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";
import { MouseInteractionComponent } from "luthe-amp/lib/input/mouse-interaction-component";
import { Text } from "troika-three-text";
import { localize } from "../language/localize.js";

class Button extends EventTarget {

    _sprite;
    _baseSprite;
    _topSprite;
    _held;
    _enabled;

    get sprite() {
        return this._sprite;
    }

    constructor(base, top) {
        super();
        this._baseSprite = base;
        this._topSprite = top;
        this._sprite = new THREE.Group();
        this._sprite.add(base);
        top.position.z = 5;
        top.position.y = 5;
        this._sprite.add(top);
        this._enabled = true;
    }

    _accept = () => {
        if(!this._held) return;
        this._baseSprite.setFrame(0);
        this._topSprite.position.y = 5;
        this._held = false;
        if(!this._enabled) return;
        Game.audio.playSound('sfxClick');
        this.dispatchEvent(new CustomEvent('click'));
    }

    addToSystem = (system) => {
        const interaction = new MouseInteractionComponent({cursor: 'pointer'}, this._baseSprite);
        system.add(interaction);
        interaction.addEventListener('dragstart', (event) => {
            this._baseSprite.setFrame(1);
            this._topSprite.position.y = 0;
            this._held = true;
        });
        interaction.addEventListener('dragmove', (event) => {
            if(!this._held) return;
            if(event.detail.intersection) return;
            this._baseSprite.setFrame(0);
            this._topSprite.position.y = 5;
            this._held = false;
        })
        interaction.addEventListener('dragend', this._accept);
        interaction.addEventListener('click', this._accept);
    }

    setEnabled = (enabled) => {
        this._enabled = enabled;
    }

}

const TextButton = (key) => {
    const base = new Sprite2D({
        texture: Game.getTexture('button'),
    });
    const textSprite = new Text();
    textSprite.text = localize(key, Game.settings.uiLanguage);
    textSprite.font = Game.font;
    textSprite.color = 0x000000;
    textSprite.fontSize = 50;
    textSprite.anchorX = 'center';
    textSprite.anchorY = '52%';
    textSprite.outlineColor = 0x000000;
    textSprite.outlineBlur = '2%';
    textSprite.sync();
    const button = new Button(base, textSprite);
    button.relocalize = () => {
        textSprite.text = localize(key, Game.settings.uiLanguage);
        textSprite.sync();
    }
    return button;
}

const CombButton = (icon) => {
    const base = new Sprite2D({
        texture: 'combButton',
        scaleX: 0.5,
        scaleY: 0.5,
    });
    const shadow = new Sprite2D({
        texture: 'shadow',
        y: 0.05,
        z: -2,
    });
    shadow.scale.set(1.6, 1.6, 1);
    shadow.material.color.set(0x3f1f00);
    shadow.material.opacity = 0.7;
    base.add(shadow);
    const top = new Sprite2D({
        texture: 'combIcons',
        scaleX: 0.5,
        scaleY: 0.5,
    });
    top.setFrame(icon);
    return new Button(base, top);
}

export { TextButton, CombButton };