import { Game, createOrthoCam, GameScreen, Sprite2D, THREE, SimpleSystem, MouseInteractionSystem } from "luthe-amp";
import ShrinkComponent from "../systems/util/shrink-component.js";
import GrowthComponent from '../systems/play-screen/growth-component.js';
import HealthSystem from "../systems/play-screen/health-system.js";
import campaignPlayScreen from "./campaign-play-screen.js";

const SCALE = 0.5;

const campaignWorldScreen = (world) => {

    const screen = new GameScreen();

    const player = {
        progress: 0,
        health: 500,
        buffRate: 0.01,
    };

    const createSubScreen = (i) => {
        return campaignPlayScreen(player, world.monsters[i], world.background, screen);
    }

    const mainScene = new THREE.Scene();
    const mainCamera = createOrthoCam();

    const background = new Sprite2D({
        texture: Game.getTexture('backgrounds'),
        z: -50,
    });
    background.setFrame(world.background);
    mainScene.add(background);

    const positions = [];
    for(let i = 0; i < 10; i++) {
        const x = ((i % 4) > 1) ? 48 : -48;
        const offsetY = ((i % 4) > 1) ? (i % 4) - 0.5 : (i % 4);
        const y = Math.sqrt(3) / 4 * 254 * (Math.floor(i / 4) * 3 + offsetY) - 400;
        positions.push(new THREE.Vector3(x, y, 0));
    }

    const simpleSystem = new SimpleSystem();
    screen.addSystem(simpleSystem);

    const combs = positions.map(pos => {
        const sprite = new Sprite2D({
            texture: Game.getTexture('honeycomb'),
            framesX: 2,
            framesY: 2,
            scaleX: 0,
            scaleY: 0,
        });
        sprite.position.copy(pos);
        mainScene.add(sprite);
        const shadow = new Sprite2D({
            texture: Game.getTexture('shadow'),
            y: 0.05,
            z: -2,
        });
        shadow.scale.set(1.6, 1.6, 1);
        shadow.material.color.set(0x3f1f00);
        shadow.material.opacity = 0.7;
        sprite.add(shadow);
        const entity = {
            fullScale: 0.5,
            size: 0,
            state: 'growing',
        }
        simpleSystem.add(new GrowthComponent(entity, sprite));
        simpleSystem.add(new ShrinkComponent(entity, sprite));
        return entity;
    });

    const healthSystem = new HealthSystem(mainScene, player.health, 500);
    screen.addSystem(healthSystem);

    screen.addSystem({mount: () => {
        healthSystem.setHealth(player.health);
        combs.forEach(comb => {
            comb.state = 'growing',
            comb.size = 0
        });
    }, update: () => {
        if(combs.find(comb => comb.state !== 'gone')) {
            return;
        }
        Game.setActiveScreen(createSubScreen(player.progress));
    }});

    screen.addListener('click', () => {
        if(combs.find(comb => comb.state === 'growing')) return;
        combs.forEach(comb => comb.state = 'shrinking');
    });

    screen.addRenderPass(mainScene, mainCamera);

    return screen;

}

export default campaignWorldScreen;