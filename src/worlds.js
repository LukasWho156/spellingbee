import Cat from "./monsters/cat.js";
import DungBeetle from "./monsters/dung-beetle.js";
import Spider from "./monsters/spider.js";
import StagBeetle from "./monsters/stag-beetle.js";

const WORLDS = [
    {
        titleKey: 'world_meadow',
        difficulty: 1,
        background: 1,
        monsters: [StagBeetle, DungBeetle, Spider, Cat],
    },
    {
        titleKey: 'world_sky',
        difficulty: 2,
        background: 0,
        monsters: [StagBeetle, DungBeetle, Spider, Cat],
    },
    {
        titleKey: 'world_woods',
        difficulty: 2,
        background: 2,
        monsters: [StagBeetle, DungBeetle, Spider, Cat],
    },
    {
        titleKey: 'world_pond',
        difficulty: 3,
        background: 3,
        monsters: [StagBeetle, DungBeetle, Spider, Cat],
    },
]

export default WORLDS;