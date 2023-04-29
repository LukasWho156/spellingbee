import WORLDS from "../worlds.js";

const ALL_MONSTERS = [];

WORLDS.forEach((world, i) => {
    if(i > 4) return;
    ALL_MONSTERS.push(...world.monsters)
});

export default ALL_MONSTERS;