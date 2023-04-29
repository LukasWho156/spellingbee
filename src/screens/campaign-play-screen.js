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
        Game.saveData.unlockedMonsters ??= {};
        Game.saveData.unlockedMonsters[monster.texture] = true;
        Game.saveToStorage('bee_saveData', Game.saveData);
        screen.monsterSystem.spawnMonster(monster);
    }, update: () => {
        if(!screen.monsterSystem.isAlive) {
            if(!signal.won) {
                const tempVolume = Game.audio.musicVolume;
                Game.audio.musicVolume = 0.2 * tempVolume;
                const fanfare = Game.audio.playSound('sfxWinningShort');
                fanfare.element.addEventListener('ended', () => {
                    const fadeIn = (x) => {
                        if(x > 1) x = 1;
                        Game.audio.musicVolume = x * tempVolume;
                        if(x < 1) setTimeout(() => fadeIn(x + 0.05), 50);
                    }
                    fadeIn(0.25);
                })
            }
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