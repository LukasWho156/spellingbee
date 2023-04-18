import { Game } from 'luthe-amp';
import { connectWS } from 'luthe-amp/lib/util/connect-ws'
import { monitorMemory } from 'luthe-amp/lib/util/monitor-memory';

import loadingScreen from './screens/loading-screen.js';
import config from './config.json';
import loadDictionary from './language/get-dictionary.js';

import texLoading from './assets/gfx/loading_indicator.png';

import texHoneycomb from './assets/gfx/honeycomb.png';
import texShadow from './assets/gfx/shadow.png';

import texCombIcons from './assets/gfx/comb_decorations.png';

import texParticles from './assets/gfx/particles.png';
import texIntents from './assets/gfx/intents.png';

import texHealthbar from './assets/gfx/healthbar.png';
import texHoneyBar from './assets/gfx/honey-bar.png';
import texRing from './assets/gfx/ring.png';
import texButton from './assets/gfx/button.png';
import texCombButton from './assets/gfx/comb_button.png';

import texBee from './assets/gfx/bee.png';
import texHurtBee from './assets/gfx/hurtbee.png';
import texStagBeetle from './assets/gfx/stag-beetle.png';
import texDungBeetle from './assets/gfx/dung-beetle.png';
import texSpider from './assets/gfx/spider.png';
import texBeekeeper from './assets/gfx/beekeeper.png';
import texCat from './assets/gfx/cat.png';
import texRat from './assets/gfx/rat.png';
import texButterfly from './assets/gfx/butterfly.png';
import texDragonfly from './assets/gfx/dragonfly.png';
import texBacteria from './assets/gfx/bacteria.png';
import texBeeEater from './assets/gfx/beeeater.png';
import texWasp from './assets/gfx/wasp.png';
import texHornet from './assets/gfx/hornet.png';
import texJunebug from './assets/gfx/junebug.png';
import texVarroa from './assets/gfx/varroa.png';
import texVenus from './assets/gfx/venus.png';
import texBear from './assets/gfx/bear.png';
import texCentipede from './assets/gfx/centipede.png';
import texCockroach from './assets/gfx/cockroach.png';
import texBombadeerBeetle from './assets/gfx/bombadierbeetle.png';
import texMosquito from './assets/gfx/mosquito.png';
import texAnt from './assets/gfx/ant.png';
import texCarp from './assets/gfx/carp.png';
import texToad from './assets/gfx/toad.png';
import texWaterskipper from './assets/gfx/waterskipper.png';
import texHedgehog from './assets/gfx/hedgehog.png';

import texBackgrounds from './assets/gfx/backgrounds.png';

import texFlowers from './assets/gfx/flowers.png';

import texBeehiveBackground from './assets/gfx/beehive-background.png';
import texBeehiveForeground from './assets/gfx/beehive-foreground.png';
import texMenuButton from './assets/gfx/menu-button.png';
import texTitle from './assets/gfx/title.png';
import texDifficulty from './assets/gfx/difficulty.png';
import texPopup from './assets/gfx/popup.png';

import fontOswald from './assets/fonts/Oswald-VariableFont_wght.ttf';
import fontTiltPrism from './assets/fonts/TiltPrism-Regular-VariableFont_XROT,YROT.ttf';
import fontEczar from './assets/fonts/Eczar-Regular.ttf';
import { preloadFont } from 'troika-three-text';

import mainMenuScreen from './screens/main-menu-screen.js';

async function main() {

    //debug: connect to websocket server to enable automatic reloading
    connectWS();

    //debug: monitor memory
    //const monitor = monitorMemory();
    //if(monitor) {
    //    setInterval(() => console.log('Memory usage:', monitor.getMemory()), 3000)
    //}

    Game.init(config);

    Game.font = fontOswald;
    Game.headerFont = fontTiltPrism;
    Game.blockFont = fontEczar;
    Game.settings = {
        playingLanguage: 'de',
        uiLanguage: 'de',
    };
    Game.dictionaries = {};

    Game.saveData = Game.loadFromStorage('bee_saveData') ?? {}

    await Game.loadTexture(texLoading, 'loading');

    const promises = [
        Game.loadTexture(texHoneycomb, 'honeycomb'),
        Game.loadTexture(texShadow, 'shadow'),
        Game.loadTexture(texCombIcons, 'combIcons', { framesX: 4, framesY: 5 }),
        Game.loadTexture(texParticles, 'particles', { framesX: 4, framesY: 3 }),
        Game.loadTexture(texIntents, 'intents', { framesX: 4, framesY: 7 }),
        Game.loadTexture(texHealthbar, 'healthbar'),
        Game.loadTexture(texHoneyBar, 'honeyBar'),
        Game.loadTexture(texRing, 'ring'),
        Game.loadTexture(texButton, 'button', { framesY: 2 }),
        Game.loadTexture(texCombButton, 'combButton', { framesY: 2 }),
        Game.loadTexture(texBee, 'bee', { framesX: 2 }),
        Game.loadTexture(texHurtBee, 'hurtbee'),
        Game.loadTexture(texStagBeetle, 'stagBeetle'),
        Game.loadTexture(texDungBeetle, 'dungBeetle'),
        Game.loadTexture(texSpider, 'spider'),
        Game.loadTexture(texBeekeeper, 'beekeeper'),
        Game.loadTexture(texCat, 'cat'),
        Game.loadTexture(texRat, 'rat'),
        Game.loadTexture(texButterfly, 'butterfly'),
        Game.loadTexture(texDragonfly, 'dragonfly'),
        Game.loadTexture(texBacteria, 'bacteria'),
        Game.loadTexture(texBeeEater, 'beeEater'),
        Game.loadTexture(texWasp, 'wasp'),
        Game.loadTexture(texHornet, 'hornet'),
        Game.loadTexture(texJunebug, 'junebug'),
        Game.loadTexture(texVarroa, 'varroa'),
        Game.loadTexture(texVenus, 'venus'),
        Game.loadTexture(texBear, 'bear'),
        Game.loadTexture(texCentipede, 'centipede'),
        Game.loadTexture(texCockroach, 'cockroach'),
        Game.loadTexture(texBombadeerBeetle, 'bombadeerBeetle'),
        Game.loadTexture(texMosquito, 'mosquito'),
        Game.loadTexture(texAnt, 'fireant'),
        Game.loadTexture(texCarp, 'carp'),
        Game.loadTexture(texToad, 'toad'),
        Game.loadTexture(texWaterskipper, 'waterskipper'),
        Game.loadTexture(texHedgehog, 'hedgehog'),
        Game.loadTexture(texBackgrounds, 'backgrounds', { framesX: 4, framesY: 2 }),
        Game.loadTexture(texFlowers, 'flowers', { framesX: 4, framesY: 3 }),
        Game.loadTexture(texBeehiveBackground, 'beehiveBackground'),
        Game.loadTexture(texBeehiveForeground, 'beehiveForeground'),
        Game.loadTexture(texMenuButton, 'menuButton'),
        Game.loadTexture(texTitle, 'title'),
        Game.loadTexture(texDifficulty, 'difficulty'),
        Game.loadTexture(texPopup, 'popup'),
        loadDictionary('de').then(dict => Game.dictionaries.de = dict),
        loadDictionary('en').then(dict => Game.dictionaries.en = dict),
        new Promise((resolve) => {
            preloadFont({ font: fontOswald }, () => resolve());
        }),
        new Promise((resolve) => {
            preloadFont({ font: fontTiltPrism }, () => resolve());
        }),
        new Promise((resolve) => {
            preloadFont({ font: fontEczar }, () => resolve());
        }),
    ];

    Game.wordFinder = new Worker(new URL('./util/worker-word-finder-manager.js', import.meta.url));

    Game.setActiveScreen(loadingScreen(promises, () => {
        Game.dictionary = Game.dictionaries[Game.settings.playingLanguage];
        Game.wordFinder.postMessage({ dictionary: Game.dictionary });
        const mainMenu = mainMenuScreen();
        Game.mainMenu = mainMenu;
        return mainMenu;
    }));

    Game.start();

}

main();