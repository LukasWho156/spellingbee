import { THREE, GameScreen, Game } from "luthe-amp"
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";
import { createOrthoCam } from "luthe-amp/lib/util/create-ortho-cam";
import { MouseInteractionSystem } from "luthe-amp/lib/input/mouse-interaction-system";
import { MouseInteractionComponent } from "luthe-amp/lib/input/mouse-interaction-component";
import { DisposalSystem } from "luthe-amp/lib/util/disposal-system";

import { CombButton, TextButton } from "../util/button.js";
import ALL_MONSTERS from "../monsters/monsters.js";
import { localize } from "../language/localize.js";
import SlideSystem from "../systems/util/slide-system.js";
import { renderH2 } from "../util/text-util.js";
import backgroundSystem from "../systems/util/background-system.js";
import SwipeHandler from "../util/swipe-handler.js";

const compendiumScreen = () => {

    let unlockedMonsters = Game.saveData.unlockedMonsters ?? {};
    const monsterSprites = [];

    let currentMonster = ALL_MONSTERS[0];
    let currentMonsterIndex = 0;

    let monsterGroupTargetPos = 0;

    const mainScene = new THREE.Scene();
    const mainCamera = createOrthoCam();
    
    const screen = new GameScreen();
    screen.addRenderPass(mainScene, mainCamera);

    const bgSys = backgroundSystem(mainScene, 0);
    screen.addSystem(bgSys);

    const slideSystem = new SlideSystem();
    screen.addSystem(slideSystem);
    
    const topGroup = new THREE.Group();
    topGroup.position.y = 500;
    mainScene.add(topGroup);
    slideSystem.add(topGroup, {
        inY: 0,
        outY: 500,
    });

    const bottomGroup = new THREE.Group();
    bottomGroup.position.y = -300;
    mainScene.add(bottomGroup);
    slideSystem.add(bottomGroup, {
        inY: 0,
        outY: -300,
    });

    const monsterGroup = new THREE.Group();
    ALL_MONSTERS.forEach((monster, i) => {
        const sprite = new Sprite2D({
            texture: monster.texture,
            x: i * 600,
            y: -350,
        });
        monsterGroup.add(sprite);
        monsterSprites.push({tex: monster.texture, sprite: sprite});
    })
    topGroup.add(monsterGroup);

    const titleText = renderH2('monster_unknown');
    titleText.anchorY = 'middle';
    titleText.sync();
    titleText.position.y = 100;
    titleText.position.z = 10;
    topGroup.add(titleText);

    const setMonster = () => {
        currentMonster = ALL_MONSTERS[currentMonsterIndex];
        monsterGroup.position.x = monsterGroupTargetPos;
        monsterGroupTargetPos = -600 * currentMonsterIndex;
        bgSys.setBackground(7, true);
        setTimeout(() => Game.mainMenu.setFromBackground(7), 10);
        const textKey = unlockedMonsters[currentMonster.texture] ? `monster_${currentMonster.texture}` : 'monster_unknown';
        titleText.text = localize(textKey, Game.settings.uiLanguage);
        titleText.sync();
    }

    const nextMonster = () => {
        currentMonsterIndex++;
        if(currentMonsterIndex >= ALL_MONSTERS.length) currentMonsterIndex = ALL_MONSTERS.length - 1;
        setMonster();
    }

    const prevMonster = () => {
        currentMonsterIndex--;
        if(currentMonsterIndex < 0) currentMonsterIndex = 0;
        setMonster();
    }

    const mis = new MouseInteractionSystem(Game.width, Game.height, mainCamera, Game.renderer.domElement);
    screen.addSystem(mis);

    const bgInteraction = new MouseInteractionComponent({}, bgSys.sprite());
    mis.add(bgInteraction);
    const swipeHandler = new SwipeHandler(bgInteraction);
    swipeHandler.addEventListener('swipe', (event) => {
        if(event.detail.direction === 'left') {
            nextMonster();
        } else {
            prevMonster();
        }
    })

    const nextButton = CombButton(1);
    nextButton.sprite.position.set(200, -500, 0);
    bottomGroup.add(nextButton.sprite);
    nextButton.addToSystem(mis);
    nextButton.addEventListener('click', () => {
        nextMonster();
    });

    const prevButton = CombButton(0);
    prevButton.sprite.position.set(-200, -500, 0);
    bottomGroup.add(prevButton.sprite);
    prevButton.addToSystem(mis);
    prevButton.addEventListener('click', () => {
        prevMonster();
    });

    const homeButton = CombButton(3);
    homeButton.sprite.position.set(0, -500, 0);
    bottomGroup.add(homeButton.sprite);
    homeButton.addToSystem(mis);
    homeButton.addEventListener('click', () => {
        slideSystem.triggerSlideout(() => Game.setActiveScreen(Game.mainMenu));
    });

    screen.addSystem({mount:  () => {
        unlockedMonsters = Game.saveData.unlockedMonsters ?? {};
        monsterSprites.forEach(s => {
            s.sprite.material.color.set(unlockedMonsters[s.tex] ? 0xffffff : 0x000000);
        })
        bgSys.setBackground(0);
        setMonster();
    }});

    screen.addSystem({update: (delta) =>  {
        prevButton.sprite.visible = currentMonsterIndex !== 0;
        nextButton.sprite.visible = currentMonsterIndex !== ALL_MONSTERS.length - 1;
        prevButton.setEnabled(prevButton.sprite.visible);
        nextButton.setEnabled(nextButton.sprite.visible);
        if(monsterGroup.position.x < monsterGroupTargetPos) {
            monsterGroup.position.x += delta * 2;
            if(monsterGroup.position.x > monsterGroupTargetPos) {
                monsterGroup.position.x = monsterGroupTargetPos;
            }
        }
        if(monsterGroup.position.x > monsterGroupTargetPos) {
            monsterGroup.position.x -= delta * 2;
            if(monsterGroup.position.x < monsterGroupTargetPos) {
                monsterGroup.position.x = monsterGroupTargetPos;
            }
        }
    }});

    return screen;

}

export default compendiumScreen;