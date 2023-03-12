import { Game } from "luthe-amp";
import { Text } from "troika-three-text";

import localize from "../language/localize.js";

const syncText = (text) => {
    return new Promise(resolve => {
        text.sync(() => resolve());
    });
}

const getTextHeight = (text) => {
    return Math.abs(text.geometry.boundingBox.max.y - text.geometry.boundingBox.min.y);
}

const renderH1 = (key) => {
    const text = new Text();
    text.position.z = 100;
    text.text = localize(key, Game.settings.uiLanguage);
    text.font = Game.headerFont;
    text.color = 0x000000;
    text.fontSize = 100;
    text.anchorX = 'center';
    text.anchorY = 'middle';
    text.outlineWidth = '10%';
    text.outlineBlur = '10%';
    text.outlineColor = 0xffaf3f;
    return text;
}

const renderH2 = (key) => {
    const text = new Text();
    text.text = localize(key, Game.settings.uiLanguage);
    text.color = 0x000000,
    text.font = Game.font;
    text.fontSize = 68;
    text.anchorX = 'center';
    text.anchorY = 'top';
    return text
}

const renderWhiteText = (key, ...replacements) => {
    const text = new Text();
    text.text = localize(key, Game.settings.uiLanguage, ...replacements);
    text.font = Game.blockFont;
    text.fontSize = 36;
    text.anchorX = 'center';
    text.anchorY = 'middle';
    text.color = 0x000000;
    text.outlineColor = 0xffffff;
    text.outlineBlur = '100%';
    return text;
}

export { syncText, getTextHeight, renderH1, renderH2, renderWhiteText }