import playScreen from "./play-screen.js";

const endlessPlayScreen = (unlockedMonsters) => {

    const screen = playScreen(500, 500, 'backgroundSky');

    let attackSpeed = 1;

    const spawnRandomMonster = () => {
        let i = Math.floor(Math.random() * unlockedMonsters.length)
        const monster = {...unlockedMonsters[i]};
        monster.speedBonus = attackSpeed;
        monster.health = 150;
        attackSpeed *= 1.05;
        screen.monsterSystem.spawnMonster(monster);
    }

    screen.addSystem({mount: () => {
        spawnRandomMonster();
    }, update: () => {
        if(!screen.monsterSystem.isAlive) {
            spawnRandomMonster();
        }
    }});

    return screen;

}

export default endlessPlayScreen;