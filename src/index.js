import { Game, connectWS, monitorMemory } from 'luthe-amp';
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
    const monitor = monitorMemory();
    if(monitor) {
        setInterval(() => console.log('Memory usage:', monitor.getMemory()), 3000)
    }

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
        Game.loadTexture(texCombIcons, 'combIcons', { framesX: 4, framesY: 4 }),
        Game.loadTexture(texParticles, 'particles'),
        Game.loadTexture(texIntents, 'intents'),
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
        Game.loadTexture(texBackgrounds, 'backgrounds', { framesX: 4, framesY: 2 }),
        Game.loadTexture(texFlowers, 'flowers'),
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

    Game.setActiveScreen(loadingScreen(promises, () => {
        Game.dictionary = Game.dictionaries[Game.settings.playingLanguage];
        const mainMenu = mainMenuScreen();
        Game.mainMenu = mainMenu;
        return mainMenu;
        /*
        return campaignWorldScreen({
            background: 3,
            monsters: [StagBeetle, DungBeetle, Spider, Cat],
        });
        */
        //return campaignPlayScreen([StagBeetle, DungBeetle, Spider, Cat][Math.floor(Math.random() * 4)]);
    }));

    Game.start();

}

main();