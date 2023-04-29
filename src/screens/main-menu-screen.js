import { THREE, Game, GameScreen } from "luthe-amp";
import { createOrthoCam } from "luthe-amp/lib/util/create-ortho-cam";
import { MouseInteractionSystem } from "luthe-amp/lib/input/mouse-interaction-system";
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";

import { TextButton } from "../util/button.js";
import endlessPlayScreen from "./endless-play-screen.js";
import worldSelectionScreen from "./world-selection-screen.js";
import SlideSystem from "../systems/util/slide-system.js";
import backgroundSystem from "../systems/util/background-system.js";
import campaignWorldScreen from "./campaign-world-screen.js";
import ALL_MONSTERS from "../monsters/monsters.js";
import SettingsPopup from "../systems/util/settings-popup.js";
import BopComponent from "../systems/play-screen/bop-component.js";

const mainMenuScreen = () => {

    const mainScene = new THREE.Scene();
    const mainCamera = createOrthoCam();
    
    const screen = new GameScreen();
    screen.addRenderPass(mainScene, mainCamera);

    const bgSys = backgroundSystem(mainScene, 0);
    screen.addSystem(bgSys);

    const campaignScreen = worldSelectionScreen();
    screen.campaignScreen = campaignScreen;

    const mis = new MouseInteractionSystem(Game.width, Game.height, mainCamera, Game.renderer.domElement);
    screen.addSystem(mis);

    const slideSystem = new SlideSystem();
    screen.addSystem(slideSystem);

    const topGroup = new THREE.Group();
    topGroup.position.y = 600;
    slideSystem.add(topGroup, {
        inY: 0,
        outY: 600,
    });
    mainScene.add(topGroup);

    const titleSprite = new Sprite2D({
        texture: 'mainMenuTitle',
        y: -325,
        z: 50,
        scaleX: 1,
        scaleY: 1,
    })
    topGroup.add(titleSprite);
    const titleBop = new BopComponent({
        bopX: 0.02,
        bopY: 0.02,
        bopFrequency: 0.0002,
        bopOffset: 0,
        size: 1,
    }, titleSprite);
    

    const bottomGroup = new THREE.Group();
    bottomGroup.position.y = -600;
    slideSystem.add(bottomGroup, {
        inY: 0,
        outY: -600,
    });
    mainScene.add(bottomGroup);

    const campaignButton = TextButton('mainMenu_campaign');
    campaignButton.sprite.position.y = -200;
    bottomGroup.add(campaignButton.sprite);
    campaignButton.addToSystem(mis);
    campaignButton.addEventListener('click', () => {
        slideSystem.triggerSlideout(() => Game.setActiveScreen(campaignScreen));
    });

    const continueButton = TextButton('mainMenu_continue');
    continueButton.sprite.position.y = -200;
    bottomGroup.add(continueButton.sprite);
    continueButton.addToSystem(mis);
    continueButton.addEventListener('click', () => {
        slideSystem.triggerSlideout(() => Game.setActiveScreen(campaignWorldScreen(Game.saveData.currentRun.world, 0, Game.saveData.currentRun)));
    });

    const endlessButton = TextButton('mainMenu_endless');
    endlessButton.sprite.position.y = -350;
    bottomGroup.add(endlessButton.sprite);
    endlessButton.addToSystem(mis);
    endlessButton.addEventListener('click', () => {
        const unlockedMonsters = ALL_MONSTERS.filter(m => !!Game.saveData.unlockedMonsters[m.texture]);
        slideSystem.triggerSlideout(() => Game.setActiveScreen(endlessPlayScreen(unlockedMonsters)));
    });

    const settingsButton = TextButton('mainMenu_settings');
    settingsButton.sprite.position.y = -500;
    bottomGroup.add(settingsButton.sprite);
    settingsButton.addToSystem(mis);

    SettingsPopup(mainScene, mis).then(popup => {
        screen.relocalize = () => {
            campaignButton.relocalize();
            continueButton.relocalize();
            endlessButton.relocalize();
            settingsButton.relocalize();
            popup.relocalize();
            campaignScreen.relocalize();
        }
        screen.addSystem(popup);
        settingsButton.addEventListener('click', () => {
            popup.open();
        });
    });

    screen.setFromBackground = (bg) => {
        bgSys.setBackground(bg);
        bgSys.setBackground(0);
    }

    screen.addSystem({mount: () => {
        Game.audio.playMusic('musicMainMenu');
        if(!!Game.saveData.unlockedMonsters) {
            endlessButton.sprite.scale.set(1, 1, 1);
        } else {
            endlessButton.sprite.scale.set(0, 0, 1);
        }
        if(!Game.saveData.currentRun) {
            campaignButton.sprite.scale.set(1, 1, 1);
            continueButton.sprite.scale.set(0, 0, 1);
        } else {
            campaignButton.sprite.scale.set(0, 0, 1);
            continueButton.sprite.scale.set(1, 1, 1);
        }
    }, update: (delta, globalTime) => {
        titleBop.update(delta, globalTime);
    }})

    return screen;

}

export default mainMenuScreen;