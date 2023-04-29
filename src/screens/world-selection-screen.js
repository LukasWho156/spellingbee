import { THREE, GameScreen, Game } from "luthe-amp"
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";
import { createOrthoCam } from "luthe-amp/lib/util/create-ortho-cam";
import { MouseInteractionSystem } from "luthe-amp/lib/input/mouse-interaction-system";
import { MouseInteractionComponent } from "luthe-amp/lib/input/mouse-interaction-component";

import { CombButton, TextButton } from "../util/button.js";
import WORLDS from "../worlds.js";
import { localize } from "../language/localize.js";
import campaignWorldScreen from "./campaign-world-screen.js";
import SlideSystem from "../systems/util/slide-system.js";
import { renderH2, renderWhiteText } from "../util/text-util.js";
import backgroundSystem from "../systems/util/background-system.js";
import SwipeHandler from "../util/swipe-handler.js";

const worldSelectionScreen = () => {

    let currentWorld = WORLDS[0];
    let currentWorldIndex = 0;

    const mainScene = new THREE.Scene();
    const mainCamera = createOrthoCam();
    
    const screen = new GameScreen();
    screen.addRenderPass(mainScene, mainCamera);

    const bgSys = backgroundSystem(mainScene, 0);
    screen.addSystem(bgSys);

    const slideSystem = new SlideSystem();
    screen.addSystem(slideSystem);
    
    const topGroup = new THREE.Group();
    topGroup.position.y = 300;
    mainScene.add(topGroup);
    slideSystem.add(topGroup, {
        inY: 0,
        outY: 300,
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

    const titleText = renderH2(currentWorld.titleKey);
    titleText.anchorY = 'middle';
    titleText.sync();
    titleText.position.y = 550;
    titleText.position.z = 10;
    topGroup.add(titleText);

    const difficultyText = renderWhiteText('selectionScreen_difficulty');
    difficultyText.sync();
    difficultyText.position.set(0, 430, 10);
    topGroup.add(difficultyText);

    const difficultyGroup = new THREE.Group();
    difficultyGroup.position.set(0, 390, 5);
    topGroup.add(difficultyGroup);

    const solvedIcon1 = new Sprite2D({
        texture: 'combIcons',
        x: 225,
        y: -410,
        scaleX: 0.4,
        scaleY: 0.4,
    });
    solvedIcon1.setFrame(7);
    topGroup.add(solvedIcon1);

    const solvedIcon2 = new Sprite2D({
        texture: 'combIcons',
        x: -225,
        y: -410,
        scaleX: 0.4,
        scaleY: 0.4,
    });
    solvedIcon2.setFrame(7);
    topGroup.add(solvedIcon2);

    const createDifficultyRating = () => {
        while(difficultyGroup.children.length > 0) {
            difficultyGroup.remove(difficultyGroup.children[0]);
        }
        for(let i = 0; i < currentWorld.difficulty; i++) {
            const x = i * 40 - (currentWorld.difficulty - 1) * 20;
            const star = new Sprite2D({
                texture: 'difficulty',
                x: x,
                scaleX: 0.25,
                scaleY: 0.25,
            });
            difficultyGroup.add(star);
        }
    }

    const setWorld = () => {
        currentWorld = WORLDS[currentWorldIndex];
        bgSys.setBackground(currentWorld.background, true);
        setTimeout(() => Game.mainMenu.setFromBackground(currentWorld.background), 10);
        titleText.text = localize(currentWorld.titleKey, Game.settings.uiLanguage);
        titleText.sync();
        createDifficultyRating();
        if(currentWorld.music) {
            Game.audio.playMusic(currentWorld.music);
        }
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

    const bgInteraction = new MouseInteractionComponent({}, bgSys.sprite());
    mis.add(bgInteraction);
    const swipeHandler = new SwipeHandler(bgInteraction);
    swipeHandler.addEventListener('swipe', (event) => {
        if(event.detail.direction === 'left') {
            nextWorld();
        } else {
            prevWorld();
        }
    })

    const startButton = TextButton('selectionScreen_startGame');
    startButton.sprite.position.y = -325;
    bottomGroup.add(startButton.sprite);
    startButton.addToSystem(mis);
    startButton.addEventListener('click', () => {
        slideSystem.triggerSlideout(() => Game.setActiveScreen(campaignWorldScreen(currentWorldIndex, currentWorld.background)));
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

    screen.addSystem({mount:  () => {
        bgSys.setBackground(0);
        setWorld();
    }});

    screen.addSystem({update: () =>  {
        const solved = Game.saveData.clearedWorlds ? !!Game.saveData.clearedWorlds[currentWorld.titleKey] : false;
        solvedIcon1.visible = solved;
        solvedIcon2.visible = solved;
        prevButton.sprite.visible = !(currentWorldIndex === 0);
        nextButton.sprite.visible = Game.saveData.finalWorldUnlocked ? 
            !(currentWorldIndex === WORLDS.length - 1) :
            currentWorldIndex < WORLDS.length - 2;
        nextButton.setEnabled(nextButton.sprite.visible);
    }});

    screen.setWorld = (i) => {
        currentWorldIndex = i;
        setWorld();
    };

    screen.relocalize = () => {
        startButton.relocalize();
        difficultyText.text = localize('selectionScreen_difficulty', Game.settings.uiLanguage);
        difficultyText.sync();
    }

    return screen;

}

export default worldSelectionScreen;