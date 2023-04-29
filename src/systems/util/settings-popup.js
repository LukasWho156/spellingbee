import { THREE, Game } from "luthe-amp";
import { MouseInteractionComponent } from "luthe-amp/lib/input/mouse-interaction-component";

import Popup from "../../util/popup.js"
import addSoundControls from "./add-sound-controls.js";

const GROWTH_RATE = 0.003;

const LANGUAGES = [
    {id: 'en', key: 'settings_language_en'},
    {id: 'de', key: 'settings_language_de'},
]

const SettingsPopup = async (scene, mis, messenger) => {

    let renderedMenu

    let state = 'closed';
    let scale = 0;

    const backdrop = new THREE.Mesh(
        new THREE.PlaneGeometry(600, 1200),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0,
        })
    )
    backdrop.layers.disable(0);
    backdrop.position.z = 75;
    scene.add(backdrop);

    const open = () => {
        if(state !== 'closed') return;
        if(messenger) {
            if(messenger.isPaused()) return;
            messenger.pause();
        }
        state = 'opening';
        backdrop.layers.enable(0);
    }

    const close = () => {
        backdrop.material.opacity = 0;
        backdrop.layers.disable(0);
        renderedMenu.scale.set(0, 0, 1);
        scale = 0;
        if(messenger) messenger.unpause();
        state = 'closed';
    }

    const bdInteraction = new MouseInteractionComponent({}, backdrop);
    bdInteraction.addEventListener('click', close);
    mis.add(bdInteraction);

    const menu = new Popup('popup', 559, 1140, 35, 15, mis);
    await menu.addHeading(`settings_heading`);

    addSoundControls(menu);
    menu.addSpace(25);

    const uiLanguageSelect = await menu.addListSelect('settings_uiLanguage', LANGUAGES,
        Math.max(LANGUAGES.findIndex(l => l.id === Game.settings.uiLanguage)));
    uiLanguageSelect.addEventListener('selectionchanged', (event) => {
        Game.settings.uiLanguage = event.detail;
        Game.saveToStorage('bee_settings', Game.settings);
        Game.mainMenu.relocalize();
    })
    const dictionarySelect = await menu.addListSelect('settings_dictLanguage', LANGUAGES,
        Math.max(LANGUAGES.findIndex(l => l.id === Game.settings.playingLanguage)));
    dictionarySelect.addEventListener('selectionchanged', (event) => {
        Game.settings.playingLanguage = event.detail;
        Game.saveToStorage('bee_settings', Game.settings);
        Game.dictionary = Game.dictionaries[Game.settings.playingLanguage];
        Game.wordFinder.postMessage({ dictionary: Game.dictionary });
    })

    //const creditsButton = menu.addButton('settings_credits');
    //creditsButton.addEventListener('click', () => console.log('Credits'));
    const deleteSaveButton = menu.addButton('settings_deleteSave');
    const resumeButton = menu.addButton('settings_close');
    resumeButton.addEventListener('click', close);

    let renderedDeleteDialog;
    const deleteConfirmDialog = new Popup('popup', 559, 1140, 35, 15, mis);
    await deleteConfirmDialog.addHeading('delete_heading');
    await deleteConfirmDialog.addTextBlock('delete_confirm');
    deleteConfirmDialog.addButton('yes').addEventListener('click', () => {
        Game.saveData = {};
        Game.saveToStorage('bee_saveData', Game.saveData);
        renderedDeleteDialog.scale.set(0, 0, 1);
    });
    deleteConfirmDialog.addButton('no').addEventListener('click', () => renderedDeleteDialog.scale.set(0, 0, 1));
    renderedDeleteDialog = deleteConfirmDialog.render();
    renderedDeleteDialog.position.z = 150;
    renderedDeleteDialog.scale.set(0, 0, 1);
    scene.add(renderedDeleteDialog);
    deleteSaveButton.addEventListener('click', () => renderedDeleteDialog.scale.set(1, 1, 1));

    renderedMenu = menu.render();
    renderedMenu.position.z = 100;
    renderedMenu.scale.set(0, 0, 1);
    scene.add(renderedMenu);

    const system = {
        open: open,
        update: (delta) => {
            if(state === 'opening') {
                scale += GROWTH_RATE * delta;
                if(scale >= 1) {
                    scale = 1;
                    state = 'opened';
                }
                renderedMenu.scale.set(scale, scale, 1);
                backdrop.material.opacity = scale * 0.5;
            }
        },
        relocalize: () => {
            renderedDeleteDialog.relocalize();
            renderedMenu.relocalize();
        }
    };

    return system;

}

export default SettingsPopup;