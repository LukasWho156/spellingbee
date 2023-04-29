import { THREE, Game } from "luthe-amp";
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";
import { Text } from "troika-three-text";

import PopupShader from "../shaders/popup-shader.js";
import { localize } from "../language/localize.js";
import { TextButton } from "./button.js";
import { syncText, getTextHeight, renderH2 } from "./text-util.js";
import ListSelection from "./list-selection.js";
import Slider from "./slider.js";

class Popup {

    _items;
    _tex;
    _width;
    _texHeight;
    _border;
    _padding;
    _mis;

    constructor(tex, width, texHeight, border, padding, mis) {
        this._items = [];
        this._tex = tex;
        this._width = width;
        this._texHeight = texHeight;
        this._border = border;
        this._padding = padding;
        this._mis = mis;
    }

    _addItem = (item) => {
        this._items.push(item);
    }

    addHeading = async (key) => {
        const heading = renderH2(key);
        await syncText(heading);
        heading.position.z = 10;
        this._addItem({ sprite: heading, height: 1.2 * getTextHeight(heading), relocalize: () => heading.text = localize(key, Game.settings.uiLanguage) });
        return heading;
    }

    addSpace = (height) => {
        this._addItem({ sprite: new THREE.Object3D(), height: height });
    }

    addTextBlock = async (key, ...replacements) => {
        const text = new Text();
        text.text = localize(key, Game.settings.uiLanguage, ...replacements);
        text.textAlign = 'center';
        text.maxWidth = this._width - (this._border + this._padding) * 2;
        text.lineHeight = 1.2;
        text.color = 0x000000,
        text.font = Game.blockFont;
        text.fontSize = 30;
        text.anchorX = 'center';
        text.anchorY = 'top';
        await syncText(text);
        //text.position.x = -width / 2 + (border + padding);
        text.position.z = 10;
        this._addItem({ sprite: text, height: getTextHeight(text) + 25, relocalize: () => text.text = localize(key, Game.settings.uiLanguage, ...replacements) });
        return text;
    }

    addSprite = (texture, scale) => {
        const sprite = new Sprite2D({
            texture: texture,
            scaleX: scale,
            scaleY: scale,
            handle: 'top',
            z: 10,
        });
        this._addItem({ sprite: sprite, height: sprite.scale.y + 20 });
        return sprite;
    }

    addButton = (key) => {
        const button = TextButton(key);
        button.addToSystem(this._mis);
        button.sprite.position.z = 10;
        this._addItem({ sprite: button.sprite, height: 150 , offsetY: 75, relocalize: button.relocalize });
        return button;
    }

    addListSelect = async (headingKey, items, defaultItem = 0) => {
        const select = new ListSelection(headingKey, items, defaultItem);
        await select.init(this._mis);
        this._addItem({ sprite: select.group, height: select.height, relocalize: select.relocalize });
        return select;
    }

    addSlider = (initialValue) => {
        const slider = new Slider(this._mis, 300, 30, initialValue);
        this._addItem({ sprite: slider.sprite, height: 60, offsetY: 25});
        return slider;
    }

    render = () => {

        const contentHeight = this._items.reduce((prev, item) => prev + item.height, 0);
        const totalHeight = contentHeight + (this._border + this._padding) * 2;

        const texture = Game.getTexture(this._tex).texture;
        texture.minFilter = THREE.LinearFilter;

        const mat = new THREE.ShaderMaterial(PopupShader);
        mat.uniforms = {
            current: {value: totalHeight},
            total: {value: this._texHeight},
            border: {value: this._border},
            map: {value: texture},
        };
        mat.transparent = true;

        const popup = new THREE.Mesh(new THREE.PlaneGeometry(this._width, totalHeight), mat);

        let caretY = contentHeight / 2;

        this._items.forEach(item => {
            item.sprite.position.y = caretY - (item.offsetY ?? 0);
            popup.add(item.sprite);
            caretY -= item.height;
        })

        popup.relocalize = () => {
            for(const item of this._items) {
                if(typeof(item.relocalize) === 'function') {
                    item.relocalize();
                }
            }
        }

        return popup;

    }

}

export default Popup;