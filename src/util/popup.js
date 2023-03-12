import { THREE, Game } from "luthe-amp";
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";
import { Text } from "troika-three-text";

import PopupShader from "../shaders/popup-shader.js";
import localize from "../language/localize.js";
import { TextButton } from "./button.js";
import { syncText, getTextHeight, renderH2 } from "./text-util.js";

const createPopup = (tex, width, texHeight, border, padding, mis) => {

    const items = [];

    const addItem = (item) => {
        items.push(item);
    }

    const addHeading = async (key) => {
        const heading = renderH2(key);
        await syncText(heading);
        heading.position.z = 10;
        addItem({ sprite: heading, height: 1.2 * getTextHeight(heading) });
        return heading;
    }

    const addSpace = (height) => {
        addItem({ sprite: new THREE.Object3D(), height: height });
    }

    const addTextBlock = async (key, ...replacements) => {
        const text = new Text();
        text.text = localize(key, Game.settings.uiLanguage, ...replacements);
        text.textAlign = 'center';
        text.maxWidth = width - (border + padding) * 2;
        text.lineHeight = 1.2;
        text.color = 0x000000,
        text.font = Game.blockFont;
        text.fontSize = 30;
        text.anchorX = 'center';
        text.anchorY = 'top';
        await syncText(text);
        //text.position.x = -width / 2 + (border + padding);
        text.position.z = 10;
        addItem({ sprite: text, height: getTextHeight(text) + 25 });
        return text;
    }

    const addSprite = (texture, scale) => {
        const sprite = new Sprite2D({
            texture: texture,
            scaleX: scale,
            scaleY: scale,
            handle: 'top',
            z: 10,
        });
        addItem({ sprite: sprite, height: sprite.scale.y + 20 });
        return sprite;
    }

    const addButton = (key) => {
        const button = TextButton(localize(key, Game.settings.uiLanguage));
        button.addToSystem(mis);
        button.sprite.position.z = 10;
        addItem({ sprite: button.sprite, height: 150 , offsetY: 75});
        return button;
    }

    const render = () => {

        const contentHeight = items.reduce((prev, item) => prev + item.height, 0);
        const totalHeight = contentHeight + (border + padding) * 2;

        const texture = Game.getTexture(tex).texture;
        texture.minFilter = THREE.LinearFilter;

        const mat = new THREE.ShaderMaterial(PopupShader);
        mat.uniforms = {
            current: {value: totalHeight},
            total: {value: texHeight},
            border: {value: border},
            map: {value: texture},
        };
        mat.transparent = true;

        const popup = new THREE.Mesh(new THREE.PlaneGeometry(width, totalHeight), mat);

        let caretY = contentHeight / 2;

        items.forEach(item => {
            item.sprite.position.y = caretY - (item.offsetY ?? 0);
            popup.add(item.sprite);
            caretY -= item.height;
        })

        return popup;

    }

    return {
        addHeading: addHeading,
        addSpace: addSpace,
        addSprite: addSprite,
        addTextBlock: addTextBlock,
        addButton: addButton,
        render: render,
    }

}

export default createPopup;