import { THREE, Game } from "luthe-amp";
import { Text } from "troika-three-text";
import { localize } from "../language/localize.js";
import { syncText, getTextHeight } from "./text-util.js";
import { CombButton } from "./button.js";

class ListSelection extends EventTarget {

    _headingKey;
    _items;
    _currentItem;

    _heading;
    _desc;

    _group;

    get group() {
        return this._group;
    }

    get height() {
        return getTextHeight(this._heading) + getTextHeight(this._desc) + 50;
    }

    constructor(headingKey, items, defaultItem = 0) {
        super();
        this._headingKey = headingKey;
        this._items = items;
        this._currentItem = defaultItem;
        this._group = new THREE.Group();
    }

    init = async (mis) => {

        const heading = new Text();
        heading.text = localize(this._headingKey, Game.settings.uiLanguage);
        heading.textAlign = 'center';
        heading.color = 0x000000,
        heading.font = Game.blockFont;
        heading.fontSize = 48;
        heading.anchorX = 'center';
        heading.anchorY = 'top';
        await syncText(heading);
        heading.position.z = 10;
        this._group.add(heading);
        this._heading = heading;

        const desc = new Text();
        desc.text = localize(this._items[this._currentItem].key, Game.settings.uiLanguage);
        desc.textAlign = 'center';
        desc.color = 0x000000,
        desc.font = Game.blockFont;
        desc.fontSize = 30;
        desc.anchorX = 'center';
        desc.anchorY = 'top';
        await syncText(desc);
        desc.position.y = -getTextHeight(heading);
        desc.position.z = 10;
        this._group.add(desc);
        this._desc = desc;

        const prevButton = CombButton(0);
        prevButton.sprite.position.set(-175, -getTextHeight(heading) - 25, 10);
        prevButton.sprite.scale.set(0.5, 0.5, 1);
        this._group.add(prevButton.sprite);
        prevButton.addToSystem(mis);
        prevButton.addEventListener('click', () => {
            this._prev();
        });

        const nextButton = CombButton(1);
        nextButton.sprite.position.set(175, -getTextHeight(heading) - 25, 10);
        nextButton.sprite.scale.set(0.5, 0.5, 1);
        this._group.add(nextButton.sprite);
        nextButton.addToSystem(mis);
        nextButton.addEventListener('click', () => {
            this._next();
        });

    }

    _setOption = () => {
        this._desc.text = localize(this._items[this._currentItem].key, Game.settings.uiLanguage);
        this.dispatchEvent(new CustomEvent('selectionchanged', {detail: this._items[this._currentItem].id}))
    }

    _prev = () => {
        this._currentItem--;
        if(this._currentItem < 0) this._currentItem = this._items.length - 1;
        this._setOption();
    }

    _next = () => {
        this._currentItem++;
        if(this._currentItem >= this._items.length) this._currentItem = 0;
        this._setOption();
    }

    relocalize = () => {
        this._heading.text = localize(this._headingKey, Game.settings.uiLanguage);
        this._heading.sync();
        this._desc.text = localize(this._items[this._currentItem].key, Game.settings.uiLanguage);
        this._desc.sync();
    }

}

export default ListSelection;