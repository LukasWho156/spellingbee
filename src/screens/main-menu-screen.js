import { THREE, Game, GameScreen } from "luthe-amp";
import { createOrthoCam } from "luthe-amp/lib/util/create-ortho-cam";
import { MouseInteractionSystem } from "luthe-amp/lib/input/mouse-interaction-system";
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";
import { MouseInteractionComponent } from "luthe-amp/lib/input/mouse-interaction-component";

import { TextButton } from "../util/button.js";
import endlessPlayScreen from "./endless-play-screen.js";
import worldSelectionScreen from "./world-selection-screen.js";
import SlideSystem from "../systems/util/slide-system.js";
import backgroundSystem from "../systems/util/background-system.js";
import campaignWorldScreen from "./campaign-world-screen.js";
import ALL_MONSTERS from "../monsters/monsters.js";
import SettingsPopup from "../systems/util/settings-popup.js";
import BopComponent from "../systems/play-screen/bop-component.js";
import tutorialScreen from "./tutorial-screen.js";
import compendiumScreen from "./compendium-screen.js";
import { Text } from "troika-three-text";

const VERSION = "v. 1.0.0";

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

    const titleInteraction = new MouseInteractionComponent({}, titleSprite);
    titleInteraction.addEventListener('click', (event) => {
        const uv = event.detail.intersection.uv;
        if(uv.x > 0.7 && uv.y < 0.4) {
            console.log('buzz');
            Game.audio.playSound('sfxBuzz');
        }
    })
    mis.add(titleInteraction);

    const bottomGroup = new THREE.Group();
    bottomGroup.position.x = -50;
    bottomGroup.position.y = -600;
    slideSystem.add(bottomGroup, {
        inY: 150,
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

    const tutorialButton = TextButton('mainMenu_tutorial');
    tutorialButton.sprite.position.y = -500;
    bottomGroup.add(tutorialButton.sprite);
    tutorialButton.addToSystem(mis);
    tutorialButton.addEventListener('click', () => {
        slideSystem.triggerSlideout(() => Game.setActiveScreen(tutorialScreen()));
    });

    const settingsButton = TextButton('mainMenu_settings');
    settingsButton.sprite.position.y = -650;
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

    const compendium = compendiumScreen();
    const compendiumSprite = new Sprite2D({
        texture: 'book',
        x: 270,
        y: 650,
        scaleX: 0.4,
        scaleY: 0.4,
    });
    bottomGroup.add(compendiumSprite);
    const compendiumInteraction = new MouseInteractionComponent({cursor: 'pointer'}, compendiumSprite);
    mis.add(compendiumInteraction)
    compendiumInteraction.addEventListener('click', () => Game.setActiveScreen(compendium));

    screen.setFromBackground = (bg) => {
        bgSys.setBackground(bg);
        bgSys.setBackground(0);
    }

    const versionText = new Text();
    versionText.fontSize = 24;
    versionText.anchorX = 'right';
    versionText.anchorY = 'bottom';
    versionText.text = VERSION;
    versionText.font = Game.blockFont;
    versionText.color = 0x000000;
    versionText.sync();
    versionText.position.set(290, -600, 0);
    mainScene.add(versionText);

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
    }});

    return screen;

}

export default mainMenuScreen;