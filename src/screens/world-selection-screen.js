import { THREE, createOrthoCam, Sprite2D, GameScreen, MouseInteractionSystem, Game } from "luthe-amp"
import { Text } from "troika-three-text";
import { CombButton, TextButton } from "../util/button.js";
import WORLDS from "../worlds.js";
import localize from "../language/localize.js";
import campaignWorldScreen from "./campaign-world-screen.js";
import SlideSystem from "../systems/util/slide-system.js";

const worldSelectionScreen = () => {

    let currentWorld = WORLDS[0];
    let currentWorldIndex = 0;

    const mainScene = new THREE.Scene();
    const mainCamera = createOrthoCam();
    
    const screen = new GameScreen();
    screen.addRenderPass(mainScene, mainCamera);

    const bg1 = new Sprite2D({
        texture: 'backgrounds',
        z: -50,
    });
    bg1.setFrame(currentWorld.background);
    mainScene.add(bg1);

    const bg2 = new Sprite2D({
        texture: 'backgrounds',
        z: -45,
    });
    bg2.setFrame(currentWorld.background);
    mainScene.add(bg2);

    screen.addSystem({update: (delta) => {
        if(bg2.material.opacity < 1) {
            bg2.material.opacity += 0.003 * delta;
            if(bg2.material.opacity >= 1) {
                bg2.material.opacity = 1;
            }
        }
    }});

    const slideSystem = new SlideSystem();
    screen.addSystem(slideSystem);
    
    const topGroup = new THREE.Group();
    topGroup.position.y = 200;
    mainScene.add(topGroup);
    slideSystem.add(topGroup, {
        inY: 0,
        outY: 200,
    });

    const bottomGroup = new THREE.Group();
    bottomGroup.position.y = -400;
    mainScene.add(bottomGroup);
    slideSystem.add(bottomGroup, {
        inY: 0,
        outY: -400,
    });

    const titleCard = new Sprite2D({
        texture: 'title',
        handle: 'top',
        y: -600,
    });
    topGroup.add(titleCard);

    const titleText = new Text();
    titleText.font = Game.font;
    titleText.fontSize = 68;
    titleText.anchorX = 'center';
    titleText.anchorY = 'middle';
    titleText.color = 0x000000;
    titleText.text = localize(currentWorld.titleKey, Game.uiLanguage);
    titleText.sync();
    titleText.position.y = 550;
    titleText.position.z = 10;
    topGroup.add(titleText);

    const setWorld = () => {
        bg1.setFrame(currentWorld.background);
        currentWorld = WORLDS[currentWorldIndex];
        bg2.material.opacity = 0;
        bg2.setFrame(currentWorld.background);
        titleText.text = localize(currentWorld.titleKey, Game.settings.uiLanguage);
        titleText.sync();
    }

    const nextWorld = () => {
        currentWorldIndex++;
        if(currentWorldIndex >= WORLDS.length) currentWorldIndex = WORLDS.length - 1;
        setWorld();
    }

    const prevWorld = () => {
        currentWorldIndex--;
        if(currentWorldIndex < 0) currentWorldIndex = 0;
        setWorld();
    }

    const mis = new MouseInteractionSystem(Game.width, Game.height, mainCamera, Game.renderer.domElement);
    screen.addSystem(mis);

    const startButton = TextButton(localize('selectionScreen_startGame', Game.settings.uiLanguage));
    startButton.sprite.position.y = -325;
    bottomGroup.add(startButton.sprite);
    startButton.addToSystem(mis);
    startButton.addEventListener('click', () => {
        slideSystem.triggerSlideout(() => Game.setActiveScreen(campaignWorldScreen(currentWorld)));
    });

    const nextButton = CombButton(1);
    nextButton.sprite.position.set(200, -500, 0);
    bottomGroup.add(nextButton.sprite);
    nextButton.addToSystem(mis);
    nextButton.addEventListener('click', () => {
        nextWorld();
    });

    const prevButton = CombButton(0);
    prevButton.sprite.position.set(-200, -500, 0);
    bottomGroup.add(prevButton.sprite);
    prevButton.addToSystem(mis);
    prevButton.addEventListener('click', () => {
        prevWorld();
    });

    const homeButton = CombButton(3);
    homeButton.sprite.position.set(0, -500, 0);
    bottomGroup.add(homeButton.sprite);
    homeButton.addToSystem(mis);
    homeButton.addEventListener('click', () => {
        slideSystem.triggerSlideout(() => Game.setActiveScreen(Game.mainMenu));
    });

    screen.addSystem({mount: () => {
        setWorld();
        bg1.setFrame(0);
    }})

    screen.addSystem({update: () =>  {
        prevButton.sprite.visible = !(currentWorldIndex === 0);
        nextButton.sprite.visible = !(currentWorldIndex === WORLDS.length - 1);
    }});

    return screen;

}

export default worldSelectionScreen;