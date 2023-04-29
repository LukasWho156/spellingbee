import { THREE, Game, GameScreen } from "luthe-amp";
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";
import { createOrthoCam } from "luthe-amp/lib/util/create-ortho-cam";
import { MouseInteractionSystem } from "luthe-amp/lib/input/mouse-interaction-system";
import { MouseInteractionComponent } from "luthe-amp/lib/input/mouse-interaction-component";
import { LoadingSystem } from "luthe-amp/lib/util/loading-system";

import Gauge from "../util/gauge.js";

const loadingScreen = (promises, nextScreen) => {

    const screen = new GameScreen();
    
    const mainScene = new THREE.Scene();
    const mainCamera = createOrthoCam();
    screen.addRenderPass(mainScene, mainCamera);

    const button = new Gauge('loading', 200, 200, 'v', [0.12, 0.89]);
    mainScene.add(button);

    let done = false;

    let shadowSprite;
    let offset;

    const mouseSys = new MouseInteractionSystem(Game.width, Game.height, mainCamera, Game.renderer.domElement);
    screen.addSystem(mouseSys);

    const entity = {cursor: 'default'};
    const interaction = new MouseInteractionComponent(entity, button);
    interaction.addEventListener('click', () => {
        if(!done) return;
        Game.audio.initSounds();
        Game.setActiveScreen(nextScreen());
    })
    mouseSys.add(interaction);

    const loadingSystem = new LoadingSystem(promises, (percentage) => { button.setValue(percentage); }, () => {
        entity.cursor = 'pointer';
        done = true;
        shadowSprite = new Sprite2D({
            texture: 'shadow',
            z: 5,
        });
        shadowSprite.material.color.set(0x3f1f00);
        shadowSprite.material.blending = THREE.AdditiveBlending;
        mainScene.add(shadowSprite);
    });
    screen.addSystem(loadingSystem);

    screen.addSystem({update: (delta, globalTime) => {
        if(!done) return;
        if(!offset) {
            offset = globalTime;
        }
        const phase = ((globalTime - offset) % 3000) / 3000;
        shadowSprite.setScale(4 * phase);
        shadowSprite.material.opacity = 1 - phase;
    }})

    return screen;

}

export default loadingScreen;