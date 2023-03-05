import { THREE, Game, MouseInteractionSystem, MouseInteractionComponent, createOrthoCam, GameScreen, LoadingSystem } from "luthe-amp";
import createGauge from "../util/gauge.js";

const loadingScreen = (promises, nextScreen) => {

    const screen = new GameScreen();
    
    const mainScene = new THREE.Scene();
    const mainCamera = createOrthoCam();
    screen.addRenderPass(mainScene, mainCamera);

    const button = createGauge('loading', 200, 200, 'v', [0.12, 0.89]);
    mainScene.add(button);

    let done = false;

    const mouseSys = new MouseInteractionSystem(Game.width, Game.height, mainCamera, Game.renderer.domElement);
    screen.addSystem(mouseSys);

    const entity = {cursor: 'default'};
    const interaction = new MouseInteractionComponent(entity, button);
    interaction.addEventListener('click', () => {
        if(!done) return;
        Game.setActiveScreen(nextScreen());
    })
    mouseSys.add(interaction);

    const loadingSystem = new LoadingSystem(promises, (percentage) => { button.setValue(percentage); }, () => {
        entity.cursor = 'pointer';
        done = true;
    });
    screen.addSystem(loadingSystem);

    return screen;

}

export default loadingScreen;