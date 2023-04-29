import { Game } from "luthe-amp";

import playScreen from "./play-screen.js";
import endlessGameOverScreen from "./endless-game-over-screen.js";

const TRACKS = [
    'musicSkyWorld',
    'musicMeadowWorld',
    'musicWoodWorld',
    'silence',
    'musicWaterWorld',
    'musicStreetWorld',
]

const endlessPlayScreen = (unlockedMonsters) => {

    let defeatedMonsters = 0;

    const screen = playScreen(500, 500, [], 0, () => endlessGameOverScreen(defeatedMonsters), true, false);

    let attackSpeed = 1;
    let firstTrack = true;

    const spawnRandomMonster = () => {
        let i = Math.floor(Math.random() * unlockedMonsters.length)
        const monster = {...unlockedMonsters[i]};
        monster.speedBonus = attackSpeed;
        monster.health = 100 + 10 * defeatedMonsters;
        attackSpeed *= 1.05;
        screen.monsterSystem.spawnMonster(monster);
        screen.backgroundSystem.setBackground(monster.background);
        if(!firstTrack) {
            const time = Game.audio.currentTrack.element.currentTime;
            const newTrack = Game.audio.getSound(TRACKS[monster.background]);
            if(time < newTrack.element.duration) {
                newTrack.element.currentTime = time;
                Game.audio.playMusic(TRACKS[monster.background], true);
                return;
            }
        }
        firstTrack = false;
        Game.audio.playMusic(TRACKS[monster.background]);
    }

    screen.addSystem({mount: () => {
        spawnRandomMonster();
    }, update: () => {
        if(!screen.monsterSystem.isAlive) {
            defeatedMonsters++;
            spawnRandomMonster();
        }
    }});

    return screen;

}

export default endlessPlayScreen;