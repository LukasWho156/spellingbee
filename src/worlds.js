import Cat from "./monsters/cat.js";
import DungBeetle from "./monsters/dung-beetle.js";
import Spider from "./monsters/spider.js";
import StagBeetle from "./monsters/stag-beetle.js";
import Butterfly from "./monsters/butterfly.js";
import Dragonfly from "./monsters/dragonfly.js";
import Rat from "./monsters/rat.js";
import Beekeeper from "./monsters/beekeeper.js";
import Bacteria from "./monsters/bacteria.js";
import BeeEater from "./monsters/bee-eater.js";
import Junebug from "./monsters/junebug.js";
import Wasp from "./monsters/wasp.js";
import Hornet from "./monsters/hornet.js";
import Centipede from "./monsters/centipede.js";
import Venus from "./monsters/venus.js";
import Mosquito from "./monsters/mosquito.js";
import Cockroach from "./monsters/cockroach.js";
import BombadeerBeetle from "./monsters/bombadeer-beetle.js";
import FireAnt from "./monsters/fire-ant.js";
import Bear from "./monsters/bear.js";
import Toad from "./monsters/toad.js";
import Hedgehog from "./monsters/hedgehog.js";
import Varroa from "./monsters/varroa.js";
import Carp from "./monsters/carp.js";
import Waterskipper from "./monsters/waterskipper.js";

const WORLDS = [
    {
        titleKey: 'world_sky',
        music: 'musicSkyWorld',
        difficulty: 1,
        background: 0,
        monsters: [Wasp, Butterfly, Junebug, Hornet, BeeEater],
    },
    {
        titleKey: 'world_meadow',
        music: 'musicMeadowWorld',
        difficulty: 2,
        background: 1,
        monsters: [Spider, Varroa, Centipede, Hedgehog, Beekeeper],
    },
    {
        titleKey: 'world_woods',
        music: 'musicWoodWorld',
        difficulty: 2,
        background: 2,
        monsters: [FireAnt, StagBeetle, BombadeerBeetle, DungBeetle, Bear],
    },
    {
        titleKey: 'world_pond',
        music: 'musicWaterWorld',
        difficulty: 3,
        background: 4,
        monsters: [Dragonfly, Waterskipper, Mosquito, Carp, Toad],
    },
    {
        titleKey: 'world_street',
        music: 'musicStreetWorld',
        difficulty: 4,
        background: 5,
        monsters: [Cockroach, Cat, Venus, Rat, Bacteria],
    },
    {
        titleKey: 'world_bossrush',
        music: 'musicBossrushWorld',
        difficulty: 5,
        background: 6,
        monsters: [BeeEater, Beekeeper, Bear, Toad, Bacteria],
    },
]

export default WORLDS;