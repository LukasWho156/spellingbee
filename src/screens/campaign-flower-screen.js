import { Game, GameScreen, THREE } from "luthe-amp";
import { createOrthoCam } from "luthe-amp/lib/util/create-ortho-cam";
import { MouseInteractionSystem } from "luthe-amp/lib/input/mouse-interaction-system";
import { ParticleSystem } from "luthe-amp/lib/graphics/systems/particle-system";
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";
import { DisposalSystem } from "luthe-amp/lib/util/disposal-system";

import { localize } from "../language/localize.js";
import HealthSystem from "../systems/play-screen/health-system.js";
import backgroundSystem from "../systems/util/background-system.js"
import pauseMenu from "../systems/util/pause-menu.js";
import Popup from "../util/popup.js";
import WORLDS from "../worlds.js";
import FLOWERS from "../flowers/flowers.js";
import FlowerSystem from "../systems/play-screen/flower-system.js";
import campaignGameOverScreen from "./campaign-game-over-screen.js";

const HEALING = 50;

const campaignFlowerScreen = (player, flower, parent) => {

    const screen = new GameScreen();

    const mainScene = new THREE.Scene();
    const mainCamera = createOrthoCam();

    const newFlower = FLOWERS.find(f => f.id === flower);

    screen.addRenderPass(mainScene, mainCamera);

    const bgSys = backgroundSystem(mainScene, WORLDS[player.world].background);
    screen.addSystem(bgSys);

    const healthSystem = new HealthSystem(mainScene, player.health, 500);
    screen.addSystem(healthSystem);

    const mis = new MouseInteractionSystem(Game.width, Game.height, mainCamera, Game.renderer.domElement);

    const flowers = player.flowers.map(id => FLOWERS.find(f => f.id === id));
    screen.addSystem(FlowerSystem(mainScene, mainScene, flowers, mis));

    screen.addSystem(mis);
    pauseMenu(mainScene, mainScene, mis, null, { callback: () => {
        Game.saveData.currentRun = null;
        Game.saveToStorage('bee_saveData', Game.saveData);
        Game.setActiveScreen(campaignGameOverScreen());
    }}).then(pm => screen.addSystem(pm));

    const particleSystem = new ParticleSystem(mainScene, 'particles', 4, 3);
    screen.addSystem(particleSystem);

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
        player.flowers.push(newFlower.id);
        Game.audio.playSound('sfxFlower');
        const sprite = new Sprite2D({
            texture: 'flowers',
            handle: 'top left',
            x: -300 + 60 * flowers.length,
            y: -510,
            scaleX: 0.12,
            scaleY: 0.12,
        });
        sprite.setFrame(newFlower.frame);
        mainScene.add(sprite);
        for(let i = 0; i < 20; i++) {
            particleSystem.spawn(6, {
                position: new THREE.Vector3(
                    (Math.random() + flowers.length) * 60 - 300,
                    Math.random() * 60 + 450,
                    50
                ),
                size: Math.random() * 0.2 + 0.3,
                fadeRate: 0.003,
                color: 0x7f7f7f,
                blending: THREE.AdditiveBlending,
            })
        }
    }

    const flowerPopup = async () => {
        const popup = new Popup('popup', 559, 1140, 35, 15, mis);
        await popup.addHeading('flower_heading');
        const sprite = popup.addSprite('flowers', 0.5);
        sprite.setFrame(newFlower.frame);
        const name = localize(`flowerName_${newFlower.id}`, Game.settings.uiLanguage);
        const power = localize(`flowerPower_${newFlower.id}`, Game.settings.uiLanguage);
        await popup.addTextBlock('flower_description', name, HEALING, power);
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
                size -= delta * 0.002;
                if(size <= 0) {
                    size = 0;
                    player.progress++;
                    Game.setActiveScreen(parent);
                }
                fp.scale.set(size, size, 1);
            }
        }})
    });

    screen.addSystem(new DisposalSystem(mainScene))

    return screen;

}

export default campaignFlowerScreen;