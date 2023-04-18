import { Game, GameScreen, THREE, SimpleSystem } from "luthe-amp";
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";
import { createOrthoCam } from "luthe-amp/lib/util/create-ortho-cam";
import { MouseInteractionSystem } from "luthe-amp/lib/input/mouse-interaction-system";
import { MouseInteractionComponent } from "luthe-amp/lib/input/mouse-interaction-component";
import { ParticleSystem } from "luthe-amp/lib/graphics/systems/particle-system";

import ShrinkComponent from "../systems/util/shrink-component.js";
import GrowthComponent from '../systems/play-screen/growth-component.js';
import HealthSystem from "../systems/play-screen/health-system.js";
import campaignPlayScreen from "./campaign-play-screen.js";
import SlideSystem from "../systems/util/slide-system.js";
import pauseMenu from "../systems/util/pause-menu.js";
import backgroundSystem from "../systems/util/background-system.js";
import WORLDS from "../worlds.js";
import BopComponent from "../systems/play-screen/bop-component.js";
import campaignFlowerScreen from "./campaign-flower-screen.js";
import FLOWERS from "../flowers/flowers.js";
import FlowerSystem from "../systems/play-screen/flower-system.js";
import drawFromArray from "../util/draw-from-array.js";
import addWinScreen from "../systems/util/win-screen.js";

const SCALE = 0.5;

const PATH = [
    { decoration: 3 },
    { decoration: 5 },
    { decoration: 4 },
    { decoration: 5 },
    { decoration: 4 },
    { decoration: 5 },
    { decoration: 4 },
    { decoration: 5 },
    { decoration: 4 },
    { decoration: 6 },
]

const COMPATIBLE_VERSION = 5;

const campaignWorldScreen = (worldIndex, fromBackground, player) => {

    const screen = new GameScreen();

    const world = WORLDS[worldIndex];

    if(player?.compatibility !== COMPATIBLE_VERSION) player = null;

    player ??= {
        world: worldIndex,
        progress: 0,
        health: 500,
        buffRate: 0.01,
        flowers: [],
        order: drawFromArray(FLOWERS, 4).map(flower => flower.id),
        compatibility: COMPATIBLE_VERSION,
    };

    const createSubScreen = (i) => {
        if(i % 2 === 0) {
            return campaignPlayScreen(player, world.monsters[i / 2], world.background, screen);
        } else {
            return campaignFlowerScreen(player, player.order[(i - 1) / 2], screen);
        }
    }

    const mainScene = new THREE.Scene();
    screen.mainScene = mainScene;
    const mainCamera = createOrthoCam();

    const bgSys = backgroundSystem(mainScene, fromBackground ?? 0);
    screen.addSystem(bgSys);
    bgSys.setBackground(world.background);

    const particleSystem = new ParticleSystem(mainScene, Game.getTexture('particles'), 4, 3);
    screen.particleSystem = particleSystem;
    screen.addSystem(particleSystem);

    const signal = { won: false };
    addWinScreen(screen, () => {
        delete Game.saveData.currentRun;
        if(!Game.saveData.clearedWorlds) {
            Game.saveData.clearedWorlds = {};
        }
        Game.saveData.clearedWorlds[world.titleKey] = true;
        Game.saveToStorage('bee_saveData', Game.saveData);
        Game.setActiveScreen(Game.mainMenu);
    }, signal);

    const positions = [];
    for(let i = 0; i < 10; i++) {
        const x = ((i % 4) > 1) ? 48 : -48;
        const offsetY = ((i % 4) > 1) ? (i % 4) - 0.5 : (i % 4);
        const y = Math.sqrt(3) / 4 * 254 * (Math.floor(i / 4) * 3 + offsetY) - 400;
        positions.push(new THREE.Vector3(x, y, 0));
    }

    const simpleSystem = new SimpleSystem();
    screen.addSystem(simpleSystem);

    const combSprites = positions.map((pos, i) => {
        const sprite = new Sprite2D({
            texture: Game.getTexture('honeycomb'),
            framesX: 2,
            framesY: 2,
            scaleX: 0,
            scaleY: 0,
        });
        sprite.position.copy(pos);
        mainScene.add(sprite);
        const decoration = new Sprite2D({
            texture: Game.getTexture('combIcons'),
            z: 3,
        });
        decoration.setFrame(PATH[i].decoration);
        sprite.add(decoration);
        sprite.userData.decoration = decoration;
        decoration.scale.set(1,1,1);
        const shadow = new Sprite2D({
            texture: Game.getTexture('shadow'),
            y: 0.05,
            z: -2,
        });
        shadow.scale.set(1.6, 1.6, 1);
        shadow.material.color.set(0x3f1f00);
        shadow.material.opacity = 0.7;
        sprite.add(shadow);
        return sprite;
    });

    const combs = combSprites.map((sprite, i) => {
        const entity = {
            fullScale: 0.5,
            size: 0,
            state: 'growing',
        }
        simpleSystem.add(new GrowthComponent(entity, sprite));
        simpleSystem.add(new ShrinkComponent(entity, sprite));
        return entity;
    });

    const bee = new Sprite2D({
        texture: 'bee',
        z: 50,
    });
    mainScene.add(bee);
    const beentity = {
        fullScale: 0.33,
        size: 0,
        state: 'growing',
        bopX: 0.05,
        bopY: 0.05,
        bopFrequency: 0.0003,
        bopOffset: 0,
        speed: 0,
    }
    simpleSystem.add(new GrowthComponent(beentity, bee));
    simpleSystem.add(new ShrinkComponent(beentity, bee));
    simpleSystem.add(new BopComponent(beentity, bee));

    const highlight = new Sprite2D({
        texture: Game.getTexture('shadow'),
        z: 5,
    });
    highlight.setScale(1.2, 1.2);
    highlight.material.color.set(0x7f3f00);
    highlight.material.opacity = 0.5;
    highlight.material.blending = THREE.AdditiveBlending;
    mainScene.add(highlight);
    screen.addSystem({update: (delta, globalTime) => {
        highlight.material.opacity = 0.5 + 0.3 * Math.sin(globalTime * 0.001);
    }})

    const highlightEntity = {
        state: 'growing',
        fullScale: 1.2,
        size: 0,
    }
    simpleSystem.add(new GrowthComponent(highlightEntity, highlight));
    simpleSystem.add(new GrowthComponent(highlightEntity, highlight));

    let targetPosition = new THREE.Vector3();
    let toTarget = new THREE.Vector3();
    screen.addSystem({update: (delta) => {
        if(beentity.speed === 0) return;
        bee.position.add(toTarget.clone().multiplyScalar(beentity.speed * delta));
        const diff = targetPosition.clone().sub(bee.position);
        if(toTarget.dot(diff) <= 0) {
            bee.position.copy(targetPosition);
            beentity.speed = 0;
            combs.forEach(comb => comb.state = 'shrinking');
            beentity.state = 'shrinking';
            highlight.state = 'shrinking';
        }
    }})

    const slideSystem = new SlideSystem();
    screen.addSystem(slideSystem);

    const topGroup = new THREE.Group();
    mainScene.add(topGroup);
    topGroup.position.y = 200;
    slideSystem.add(topGroup, {
        inY: 0,
        outY: 200,
        ignoreSlideout: true,
    });

    const healthSystem = new HealthSystem(topGroup, player.health, 500);
    screen.addSystem(healthSystem);

    const flowerGroup = new THREE.Group();
    topGroup.add(flowerGroup);

    const win = () => {
        let i = 0;
        setInterval(() => {
            if(i > 10) return;
            if(i === 10) {
                signal.won = true;
                i++;
                return;
            }
            for(let j = 0; j < 10; j++) {
                combSprites[i].userData.decoration.setFrame(7);
                particleSystem.spawn(0, {
                    position: positions[i].clone().add(new THREE.Vector3(0, 0, 100)),
                    velocity: new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.5, 0),
                    acceleration: new THREE.Vector3(0, -0.002, 0),
                    opacity: 1,
                    size: Math.random() * 0.5 + 0.25,
                    fadeRate: 0.001,
                    rotation: Math.random() * Math.PI,
                    spin: (Math.random() - 0.5) * Math.PI * 0.01,
                    color: 0x7f3f00,
                    blending: THREE.AdditiveBlending,
                })
            }
            i++;
        }, 250)
    }

    screen.addSystem({mount: () => {
        console.log(player.progress);
        Game.saveData.currentRun = player;
        Game.saveToStorage('bee_saveData', Game.saveData);
        healthSystem.setHealth(player.health);
        bee.position.copy(positions[player.progress]);
        bee.position.z = 50;
        if(player.progress < 9) {
            targetPosition.copy(positions[player.progress + 1]);
            targetPosition.z = 50;
        }
        toTarget = targetPosition.clone().sub(bee.position);
        
        beentity.size = 0;
        beentity.state = 'growing',
        combs.forEach(comb => {
            comb.state = 'growing',
            comb.size = 0
        });

        combSprites.forEach((sprite, i) => {
            sprite.setFrame(i <= player.progress ? 2 : 0)
        })
        if(player.progress < 9) {
            highlight.position.copy(positions[player.progress + 1]);
            highlight.position.z = 5;
        } else {
            highlight.visible = false;
        }

        while(flowerGroup.children.length > 0) {
            flowerGroup.remove(flowerGroup.children[0]);
        }
        const flowers = player.flowers.map(id => FLOWERS.find(f => f.id === id));
        screen.addSystem(FlowerSystem(mainScene, topGroup, flowers, mis));

        if(player.progress === 9) {
            setTimeout(win, 250);
        }
    }, update: () => {
        if(combs.find(comb => comb.state !== 'gone')) {
            return;
        }
        Game.setActiveScreen(createSubScreen(player.progress));
    }});

    const mis = new MouseInteractionSystem(Game.width, Game.height, mainCamera, Game.renderer.domElement);
    screen.addSystem(mis);
    pauseMenu(mainScene, topGroup, mis).then(pm => screen.addSystem(pm));

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(600, 1200),
        new THREE.MeshBasicMaterial({opacity: 0, transparent: true})
    );
    mainScene.add(plane);
    const contInteraction = new MouseInteractionComponent({}, plane);
    contInteraction.addEventListener('click', () => {
        if(combs.find(comb => comb.state === 'growing') || player.progress === 9) return;
        beentity.speed = 0.003;
    });
    mis.add(contInteraction);

    screen.addRenderPass(mainScene, mainCamera);

    return screen;

}

export default campaignWorldScreen;