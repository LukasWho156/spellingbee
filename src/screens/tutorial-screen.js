import { THREE, Game, GameScreen } from "luthe-amp";
import { createOrthoCam } from "luthe-amp/lib/util/create-ortho-cam";
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";
import { DisposalSystem } from "luthe-amp/lib/util/disposal-system";
import { MouseInteractionSystem } from "luthe-amp/lib/input/mouse-interaction-system";
import { MouseInteractionComponent } from "luthe-amp/lib/input/mouse-interaction-component";
import { ParticleSystem } from "luthe-amp/lib/graphics/systems/particle-system";

import { CombButton } from "../util/button.js";
import createInfoPopup from "../systems/util/info-popup.js";

const coords = [
    {x: 150, y: 40, tutorial: 'honeyStock'},
    {x: 234, y: 340, tutorial: 'enemy'},
    {x: 134, y: 498, tutorial: 'enemyHealthBar'},
    {x: 518, y: 470, tutorial: 'intent'},
    {x: 518, y: 370, tutorial: 'statuses'},
    {x: 550, y: 1154, tutorial: 'reroll'},
    {x: 488, y: 786, tutorial: 'joker'},
    {x: 488, y: 898, tutorial: 'specialComb'},
    {x: 302, y: 900, tutorial: 'basics'},
    {x: 560, y: 40, tutorial: 'menuButton'},
    {x: 108, y: 1008, tutorial: 'aging'},
    {x: 22, y: 113, tutorial: 'flowers'},
]

class PointOfInterest {

    _sprite;
    _tutorial;
    _particleSystem;
    _particleTimer;
    _popup;

    get sprite() {
        return this._sprite;
    }

    constructor(x, y, tutorial, particleSystem) {
        this._sprite = new Sprite2D({
            texture: 'particles',
            x: x,
            y: y,
            scaleX: 0,
            scaleY: 0,
        });
        this._sprite.material.color.set(0x007f00);
        this._sprite.material.opacity = 0.8;
        this._sprite.setFrame(10);
        this._tutorial = tutorial;
        this._particleSystem = particleSystem;
        this._particleTimer = 200;
    }

    update = (delta, globalTime) => {
        this._popup?.update(delta);
        this._sprite.setScale(0.9 + 0.1 * Math.sin(globalTime * 0.001));
        this._particleTimer -= delta;
        if(this._particleTimer < 0) {
            this._particleTimer = 250;
            this._particleSystem.spawn(6, {
                position: new THREE.Vector3(50 * Math.random() - 25, 50 * Math.random() - 25, 0).add(this._sprite.position),
                size: 0.4,
                opacity: 0.5,
                fadeRate: 0.001,
                color: 0x7fff7f,
            });
        }
    }

    createTutorialPopup = (scene, mis) => {
        createInfoPopup(
            scene,
            `tutorialHeading_${this._tutorial}`,
            `tutorialText_${this._tutorial}`,
            null,
            null,
            mis,
        ).then(popup => {
            this._popup = popup;
            const interaction = new MouseInteractionComponent({ cursor: 'pointer' }, this._sprite);
            interaction.addEventListener('click', () => popup.open());
            mis.add(interaction);
        })
    }

}

const tutorialScreen = () => {

    const mainScene = new THREE.Scene();
    const mainCamera = createOrthoCam();

    const screen = new GameScreen();
    screen.addRenderPass(mainScene, mainCamera);

    const particleSystem = new ParticleSystem(mainScene, 'particles', 4, 3);
    screen.addSystem(particleSystem);

    const mis = new MouseInteractionSystem(Game.width, Game.height, mainCamera, Game.renderer.domElement)
    screen.addSystem(mis);

    const background = new Sprite2D({
        texture: 'tutorial',
    });
    mainScene.add(background);

    const pois = coords.map(c => new PointOfInterest(c.x - 300, c.y - 600, c.tutorial, particleSystem));
    pois.forEach(poi => {
        mainScene.add(poi.sprite);
        poi.createTutorialPopup(mainScene, mis);
    })
    screen.addSystem({update: (delta, globalTime) => {
        pois.forEach(poi => poi.update(delta, globalTime));
    }})

    const homeButton = CombButton(3);
    homeButton.sprite.position.set(-230, -540, 0);
    mainScene.add(homeButton.sprite);
    homeButton.addToSystem(mis);
    homeButton.addEventListener('click', () => Game.setActiveScreen(Game.mainMenu));

    screen.addSystem(new DisposalSystem(mainScene));

    return screen;

}

export default tutorialScreen;