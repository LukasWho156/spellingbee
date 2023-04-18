import { Game } from "luthe-amp";

import playScreen from "./play-screen.js";
import campaignGameOverScreen from "./campaign-game-over-screen.js";
import FLOWERS from "../flowers/flowers.js";
import addWinScreen from "../systems/util/win-screen.js";


const campaignPlayScreen = (player, monster, background, parent) => {

    const flowers = player.flowers.map(id => FLOWERS.find(f => f.id === id));

    const screen = playScreen(player.health, 500, flowers, background, () => {
        Game.saveData.currentRun = null;
        Game.saveToStorage('bee_saveData', Game.saveData);
        return campaignGameOverScreen();
    });

    const signal = { won: false };

    screen.addSystem({mount: () => {
        //monster.health = 1;
        screen.monsterSystem.spawnMonster(monster);
    }, update: () => {
        if(!screen.monsterSystem.isAlive) {
            signal.won = true;
        }
    }})

    addWinScreen(screen, () => {
        player.health = screen.health();
        player.progress++;
        Game.setActiveScreen(parent);
    }, signal)

    return screen;

}

export default campaignPlayScreen;