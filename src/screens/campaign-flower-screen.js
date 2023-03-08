import { Game, createOrthoCam, GameScreen, THREE, MouseInteractionSystem } from "luthe-amp";
import HealthSystem from "../systems/play-screen/health-system.js";
import backgroundSystem from "../systems/util/background-system.js"
import pauseMenu from "../systems/util/pause-menu.js";
import createPopup from "../util/popup.js";
import WORLDS from "../worlds.js";

const HEALING = 100;

const campaignFlowerScreen = (player, parent) => {

    const screen = new GameScreen();

    const mainScene = new THREE.Scene();
    const mainCamera = createOrthoCam();

    screen.addRenderPass(mainScene, mainCamera);

    const bgSys = backgroundSystem(mainScene, WORLDS[player.world].background);
    screen.addSystem(bgSys);

    const healthSystem = new HealthSystem(mainScene, player.health, 500);
    screen.addSystem(healthSystem);

    const mis = new MouseInteractionSystem(Game.width, Game.height, mainCamera, Game.renderer.domElement);
    screen.addSystem(mis);
    pauseMenu(mainScene, mainScene, mis).then(pm => screen.addSystem(pm));

    let chosen = false;

    const heal = () => {
        if(chosen) return;
        chosen = true;
        healthSystem.heal(HEALING);
        player.health = healthSystem.health;
    }

    const petal = () => {
        if(chosen) return;
        chosen = true;
        console.log('Received Petal');
    }

    const flowerPopup = async () => {
        const popup = createPopup('popup', 559, 1140, 35, 15, mis);
        await popup.addHeading('flower_heading');
        popup.addSprite('flowers', 0.5);
        await popup.addTextBlock('flower_description', 'einen Löwenzahn', HEALING, 'steigert sich die Effektivität deiner Spezialwaben');
        const nectarButton = popup.addButton('flower_buttonNectar');
        nectarButton.addEventListener('click', heal);
        const petalButton = popup.addButton('flower_buttonPetal');
        petalButton.addEventListener('click', petal);
        return popup.render()
    }

    flowerPopup().then(fp => {
        fp.position.y = -50;
        fp.scale.set(0, 0, 1);
        let size = 0;
        mainScene.add(fp);
        screen.addSystem({update: (delta) => {
            if(!chosen && size < 1) {
                size += delta * 0.003;
                if(size >= 1) {
                    size = 1;
                }
                fp.scale.set(size, size, 1);
            }
            if(chosen && size > 0) {
                size -= delta * 0.003;
                if(size <= 0) {
                    size = 0;
                    player.progress++;
                    Game.setActiveScreen(parent);
                }
                fp.scale.set(size, size, 1);
            }
        }})
    });

    return screen;

}

export default campaignFlowerScreen;