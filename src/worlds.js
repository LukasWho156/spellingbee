import Cat from "./monsters/cat.js";
import DungBeetle from "./monsters/dung-beetle.js";
import Spider from "./monsters/spider.js";
import StagBeetle from "./monsters/stag-beetle.js";
import Butterfly from "./monsters/butterfly.js";
import Dragonfly from "./monsters/dragonfly.js";

const WORLDS = [
    {
        titleKey: 'world_sky',
        difficulty: 1,
        background: 0,
        monsters: [Butterfly, StagBeetle, DungBeetle, Spider, Cat],
    },
    {
        titleKey: 'world_meadow',
        difficulty: 2,
        background: 1,
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
        background: 4,
        monsters: [Dragonfly, StagBeetle, DungBeetle, Spider, Cat],
    },
    {
        titleKey: 'world_street',
        difficulty: 4,
        background: 5,
        monsters: [StagBeetle, DungBeetle, Spider, Cat],
    },
    {
        titleKey: 'world_bossrush',
        difficulty: 5,
        background: 6,
        monsters: [StagBeetle, DungBeetle, Spider, Cat],
    },
]

export default WORLDS;