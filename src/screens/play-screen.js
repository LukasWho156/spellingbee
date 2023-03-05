import { THREE, Game, GameScreen, createOrthoCam, ParticleSystem, Sprite2D, ExtendedShaderPass } from "luthe-amp"

import BoardSystem from "../systems/play-screen/board-system.js";
import MonsterSystem from "../systems/play-screen/monster-system.js";
import HealthSystem from "../systems/play-screen/health-system.js";
import makeTouchSystem from "../systems/play-screen/touch-system.js";
import WordEval from "../systems/play-screen/word-eval.js";
import BloodShader from "../shaders/blood-shader.js";
import CombStatusSystem from "../systems/play-screen/comb-status-system.js";

const playScreen = (health, maxHealth, background) => {

    const screen = new GameScreen();

    const mainScene = new THREE.Scene();
    screen.mainScene = mainScene;
    const mainCamera = createOrthoCam();

    screen.addRenderPass(mainScene, mainCamera);

    const bgSprite = new Sprite2D({
        texture: Game.getTexture('backgrounds'),
        z: -50,
    });
    bgSprite.setFrame(background);
    mainScene.add(bgSprite);

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
    healthbarGroup.position.y = 350;
    mainScene.add(healthbarGroup);

    const bloodPass = new ExtendedShaderPass(BloodShader);
    screen.addPostProcessingPass(bloodPass);

    const particleSystem = new ParticleSystem(healthbarGroup, Game.getTexture('particles'), 4, 2);
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

    const monsterSys = new MonsterSystem(mainScene, particleSystem, messenger);
    screen.addSystem(monsterSys);
    screen.monsterSystem = monsterSys;

    const evaluator = new WordEval(board, messenger);

    makeTouchSystem(screen, mainCamera, board, evaluator, beehiveGroup, healthbarGroup, messenger);

    screen.addSystem({update: (delta) => {
        if(beehiveGroup.position.y < 0) {
            beehiveGroup.position.y += delta * 0.003 * 350;
            if(beehiveGroup.position.y > 0) {
                beehiveGroup.position.y = 0;
            }
        }
        if(healthbarGroup.position.y > 0) {
            healthbarGroup.position.y -= delta * 0.003 * 350;
            if(healthbarGroup.position.y < 0) {
                healthbarGroup.position.y = 0;
            }
        }
    }});

    screen.addListener('keydown', (event) => {
        if(messenger.isPaused()) {
            messenger.unpause();
        } else {
            messenger.pause();
        }
    })

    return screen;

}

export default playScreen;