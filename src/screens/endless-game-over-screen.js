import { THREE, Game, createOrthoCam, GameScreen, Sprite2D } from "luthe-amp";
import GrowthComponent from "../systems/play-screen/growth-component.js";
import SlideSystem from "../systems/util/slide-system.js";
import { renderH1, renderWhiteText } from "../util/text-util.js";

const endlessGameOverScreen = (defeated) => {

    const highscore = Game.saveData?.endlessHighscore ?? 0;

    const mainScene = new THREE.Scene();
    const mainCamera = createOrthoCam();

    //mainScene.add(new THREE.Mesh(
    //    new THREE.PlaneGeometry(600, 1200),
    //    new THREE.MeshBasicMaterial({color: 0x3f3f3f})
    //))

    const screen = new GameScreen();
    screen.addRenderPass(mainScene, mainCamera);

    const gameOverText = renderH1('gameOver_heading');
    gameOverText.outlineOpacity = 0;
    gameOverText.sync();
    gameOverText.position.y = 500;
    mainScene.add(gameOverText);

    const sprite = new Sprite2D ({
        texture: 'hurtbee',
        scaleX: 0,
        scaleY: 0,
        y: -50,
    })
    mainScene.add(sprite);
    const entity = {
        size: 0,
        fullScale: 1.35,
        state: 'growing',
    };
    const growth = new GrowthComponent(entity, sprite, 0.001);

    const slideSystem = new SlideSystem(0.001);
    screen.addSystem(slideSystem);

    const bottom = new THREE.Group();
    mainScene.add(bottom);
    bottom.position.y = -300;
    slideSystem.add(bottom, {
        inY: 0,
        outY: -300,
    });

    const scoreText = renderWhiteText('gameOver_score', defeated);
    scoreText.position.y = -400;
    scoreText.sync();
    bottom.add(scoreText);

    const highscoreText = (defeated > highscore) ?
        renderWhiteText('gameOver_record') :
        renderWhiteText('gameOver_highscore', highscore);
    highscoreText.position.y = -500;
    highscoreText.maxWidth = 550;
    highscoreText.textAlign = 'center';
    highscoreText.sync();
    bottom.add(highscoreText);

    if(defeated > highscore) {
        Game.saveData.endlessHighscore = defeated;
        Game.saveToStorage('bee_saveData', Game.saveData);
    }

    screen.addSystem({update: (delta) => {
        growth.update(delta);
        if(slideSystem._state === 'slideout') {
            if(gameOverText.outlineOpacity > 0) {
                gameOverText.outlineOpacity -= 0.001 * delta;
                if(gameOverText.outlineOpacity < 0) {
                    gameOverText.outlineOpacity = 0;
                }
            }
            return;
        }
        if(gameOverText.outlineOpacity < 1) {
            gameOverText.outlineOpacity += 0.001 * delta;
            if(gameOverText.outlineOpacity >= 1) {
                gameOverText.outlineOpacity = 1;
            }
            gameOverText.sync();
        }
    }});

    screen.addListener('click', () => {
        if(!slideSystem.ready) return;
        slideSystem.triggerSlideout(() => {
            Game.mainMenu.setFromBackground(3);
            Game.setActiveScreen(Game.mainMenu)
        });
    })

    return screen;

}

export default endlessGameOverScreen;