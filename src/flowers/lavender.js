const Lavender = {

    id: 'lavender',
    frame: 2,

    onEnemySpawned: (enemy) => {
        enemy.speedBonus *= 0.9;
    }

}

export default Lavender;