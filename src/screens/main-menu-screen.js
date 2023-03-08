import { THREE, Game, Sprite2D, createOrthoCam, GameScreen, MouseInteractionSystem } from "luthe-amp";
import { TextButton } from "../util/button.js";
import localize from "../language/localize.js";
import Cat from "../monsters/cat.js";
import DungBeetle from "../monsters/dung-beetle.js";
import Spider from "../monsters/spider.js";
import StagBeetle from "../monsters/stag-beetle.js";
import endlessPlayScreen from "./endless-play-screen.js";
import worldSelectionScreen from "./world-selection-screen.js";
import SlideSystem from "../systems/util/slide-system.js";
import createPopup from "../util/popup.js";
import backgroundSystem from "../systems/util/background-system.js";
import campaignWorldScreen from "./campaign-world-screen.js";

const mainMenuScreen = () => {

    const mainScene = new THREE.Scene();
    const mainCamera = createOrthoCam();
    
    const screen = new GameScreen();
    screen.addRenderPass(mainScene, mainCamera);

    const bgSys = backgroundSystem(mainScene, 0);
    screen.addSystem(bgSys);

    const campaignScreen = worldSelectionScreen();

    const mis = new MouseInteractionSystem(Game.width, Game.height, mainCamera, Game.renderer.domElement);
    screen.addSystem(mis);

    const slideSystem = new SlideSystem();
    screen.addSystem(slideSystem);

    const bottomGroup = new THREE.Group();
    bottomGroup.position.y = -600;
    slideSystem.add(bottomGroup, {
        inY: 0,
        outY: -600,
    });
    mainScene.add(bottomGroup);

    const campaignButton = TextButton(localize('mainMenu_campaign', Game.settings.uiLanguage));
    campaignButton.sprite.position.y = -200;
    bottomGroup.add(campaignButton.sprite);
    campaignButton.addToSystem(mis);
    campaignButton.addEventListener('click', () => {
        slideSystem.triggerSlideout(() => Game.setActiveScreen(campaignScreen));
    });

    const continueButton = TextButton(localize('mainMenu_continue', Game.settings.uiLanguage));
    continueButton.sprite.position.y = -200;
    bottomGroup.add(continueButton.sprite);
    continueButton.addToSystem(mis);
    continueButton.addEventListener('click', () => {
        slideSystem.triggerSlideout(() => Game.setActiveScreen(campaignWorldScreen(Game.saveData.currentRun.world, 0, Game.saveData.currentRun)));
    });

    const endlessButton = TextButton(localize('mainMenu_endless', Game.settings.uiLanguage));
    endlessButton.sprite.position.y = -350;
    bottomGroup.add(endlessButton.sprite);
    endlessButton.addToSystem(mis);
    endlessButton.addEventListener('click', () => {
        slideSystem.triggerSlideout(() => Game.setActiveScreen(endlessPlayScreen([StagBeetle, DungBeetle, Spider, Cat])));
    });

    const settingsButton = TextButton(localize('mainMenu_settings', Game.settings.uiLanguage));
    settingsButton.sprite.position.y = -500;
    bottomGroup.add(settingsButton.sprite);
    settingsButton.addToSystem(mis);
    settingsButton.addEventListener('click', () => {
        // TODO
    });

    screen.setFromBackground = (bg) => {
        bgSys.setBackground(bg);
        bgSys.setBackground(0);
    }

    screen.addSystem({mount: () => {
        if(!Game.saveData.currentRun) {
            campaignButton.sprite.scale.set(1, 1, 1);
            continueButton.sprite.scale.set(0, 0, 1);
        } else {
            campaignButton.sprite.scale.set(0, 0, 1);
            continueButton.sprite.scale.set(1, 1, 1);
        }
    }})

    return screen;

}

export default mainMenuScreen;