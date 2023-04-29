import { THREE, Game, GameScreen } from "luthe-amp"
import { createOrthoCam } from "luthe-amp/lib/util/create-ortho-cam";
import { ParticleSystem } from "luthe-amp/lib/graphics/systems/particle-system";
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";
import { ExtendedShaderPass } from "luthe-amp/lib/post-processing/extended-shader-pass";
import { DisposalSystem } from "luthe-amp/lib/util/disposal-system";

import BoardSystem from "../systems/play-screen/board-system.js";
import MonsterSystem from "../systems/play-screen/monster-system.js";
import HealthSystem from "../systems/play-screen/health-system.js";
import makeTouchSystem from "../systems/play-screen/touch-system.js";
import WordEval from "../systems/play-screen/word-eval.js";
import BloodShader from "../shaders/blood-shader.js";
import CombStatusSystem from "../systems/play-screen/comb-status-system.js";
import SlideSystem from "../systems/util/slide-system.js";
import pauseMenu from "../systems/util/pause-menu.js";
import backgroundSystem from "../systems/util/background-system.js";
import FlowerSystem from "../systems/play-screen/flower-system.js";

const playScreen = (health, maxHealth, flowers, background, gameOverScreen, slideIn, mainMenu = true) => {

    const screen = new GameScreen();

    const mainScene = new THREE.Scene();
    screen.mainScene = mainScene;
    const mainCamera = createOrthoCam();

    screen.addRenderPass(mainScene, mainCamera);

    const bgSys = backgroundSystem(mainScene, background);
    screen.addSystem(bgSys);
    screen.backgroundSystem = bgSys

    const beehiveGroup = new THREE.Group();
    beehiveGroup.add(new Sprite2D({
        texture: Game.getTexture('beehiveBackground'),
        z: -25,
    }));
    beehiveGroup.add(new Sprite2D({
        texture: Game.getTexture('beehiveForeground'),
        z: 25,
    }));

    const healthbarGroup = new THREE.Group();
    if(slideIn) healthbarGroup.position.y = 200;
    mainScene.add(healthbarGroup);

    const bloodPass = new ExtendedShaderPass(BloodShader);
    screen.addPostProcessingPass(bloodPass);

    const particleSystem = new ParticleSystem(healthbarGroup, Game.getTexture('particles'), 4, 3);
    screen.addSystem(particleSystem);
    screen.particleSystem = particleSystem;

    const messenger = {};
    screen.messenger = messenger;

    let _paused = false;
    messenger.pause = () => {
        _paused = true;
    }
    messenger.unpause = () => {
        _paused = false;
    }
    messenger.isPaused = () => {
        return _paused;
    }

    messenger.particleSystem = particleSystem;

    const healthSys = new HealthSystem(healthbarGroup, health, maxHealth, bloodPass, messenger);
    screen.addSystem(healthSys);
    screen.health = () => healthSys.health;

    const board = new BoardSystem(new THREE.Vector3(0, -300, 0), particleSystem, messenger);
    screen.addSystem(board);
    beehiveGroup.add(board.board);

    beehiveGroup.position.y = -350;
    mainScene.add(beehiveGroup);

    const combStatus = new CombStatusSystem(board, messenger);
    screen.addSystem(combStatus);

    screen.addSystem(board.restockSystem);

    const evaluator = new WordEval(board, messenger);

    const mis = makeTouchSystem(screen, mainCamera, board, evaluator, beehiveGroup, messenger);

    const monsterSys = new MonsterSystem(mainScene, particleSystem, messenger, mis);
    screen.addSystem(monsterSys);
    screen.monsterSystem = monsterSys;

    screen.addSystem(FlowerSystem(mainScene, healthbarGroup, flowers, mis, messenger));

    pauseMenu(mainScene, healthbarGroup, mis, messenger, {
        callback: () => healthSys.dealDamage(10000),
    }, mainMenu).then(pm => screen.addSystem(pm));

    const deathPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(600, 1200),
        new THREE.MeshBasicMaterial({
            color: 0x000000,
            opacity: 0,
            transparent: true,
        })
    );
    deathPlane.position.z = 300;
    mainScene.add(deathPlane);
    
    screen.addSystem({update: (delta) => {
        if(healthSys.health <= 0) {
            if(!messenger.isPaused()) messenger.pause();
            deathPlane.material.opacity += 0.001 * delta;
            if(deathPlane.material.opacity >= 1) Game.setActiveScreen(gameOverScreen());
        }
    }})

    const slideSystem = new SlideSystem();
    screen.addSystem(slideSystem);
    slideSystem.add(beehiveGroup, {
        inY: 0,
        outY: -350,
    });
    slideSystem.add(healthbarGroup, {
        inY: 0,
        outY: 200,
    })

    screen.addSystem(new DisposalSystem(mainScene));

    return screen;

}

export default playScreen;