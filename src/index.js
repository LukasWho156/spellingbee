import { Game, connectWS } from 'luthe-amp';
import loadingScreen from './screens/loading-screen.js';
import config from './config.json';
import loadDictionary from './language/get-dictionary.js';

import texLoading from './assets/gfx/loading_indicator.png';

import texHoneycomb from './assets/gfx/honeycomb.png';
import texShadow from './assets/gfx/shadow.png';

import texJoker from './assets/gfx/joker.png';
import texStatusWebbed from './assets/gfx/status_webbed.png';
import texStatusScratched from './assets/gfx/status_scratched.png';
import texCombIcons from './assets/gfx/comb_decorations.png';

import texParticles from './assets/gfx/particles.png';
import texIntents from './assets/gfx/intents.png';

import texHealthbar from './assets/gfx/healthbar.png';
import texHoneyBar from './assets/gfx/honey-bar.png';
import texRing from './assets/gfx/ring.png';
import texButton from './assets/gfx/button.png';
import texCombButton from './assets/gfx/comb_button.png';

import texBee from './assets/gfx/bee-reroll.png';
import texStagBeetle from './assets/gfx/stag-beetle.png';
import texDungBeetle from './assets/gfx/dung-beetle.png';
import texSpider from './assets/gfx/spider.png';
import texBeekeeper from './assets/gfx/beekeeper.png';
import texCat from './assets/gfx/cat.png';
import texRat from './assets/gfx/rat.png';

import texBackgrounds from './assets/gfx/backgrounds.png';

import texBeehiveBackground from './assets/gfx/beehive-background.png';
import texBeehiveForeground from './assets/gfx/beehive-foreground.png';
import texMenuButton from './assets/gfx/menu-button.png';
import texTitle from './assets/gfx/title.png';

import fontOswald from './assets/fonts/Oswald-VariableFont_wght.ttf';
import fontTiltPrism from './assets/fonts/TiltPrism-Regular-VariableFont_XROT,YROT.ttf';
import { preloadFont } from 'troika-three-text';

import worldSelectionScreen from './screens/world-selection-screen.js';
import mainMenuScreen from './screens/main-menu-screen.js';

async function main() {

    //debug: connect to websocket server to enable automatic reloading
    connectWS();

    Game.init(config);

    Game.font = fontOswald;
    Game.headerFont = fontTiltPrism;
    Game.settings = {
        playingLanguage: 'de',
        uiLanguage: 'de',
    };
    Game.dictionaries = {};

    await Game.loadTexture(texLoading, 'loading');

    const promises = [
        Game.loadTexture(texHoneycomb, 'honeycomb'),
        Game.loadTexture(texShadow, 'shadow'),
        Game.loadTexture(texJoker, 'joker'),
        Game.loadTexture(texStatusWebbed, 'statusWebbed'),
        Game.loadTexture(texStatusScratched, 'statusScratched'),
        Game.loadTexture(texCombIcons, 'combIcons', { framesX: 4, framesY: 4 }),
        Game.loadTexture(texParticles, 'particles'),
        Game.loadTexture(texIntents, 'intents'),
        Game.loadTexture(texHealthbar, 'healthbar'),
        Game.loadTexture(texHoneyBar, 'honeyBar'),
        Game.loadTexture(texRing, 'ring'),
        Game.loadTexture(texButton, 'button', { framesY: 2 }),
        Game.loadTexture(texCombButton, 'combButton', { framesY: 2 }),
        Game.loadTexture(texBee, 'bee'),
        Game.loadTexture(texStagBeetle, 'stagBeetle'),
        Game.loadTexture(texDungBeetle, 'dungBeetle'),
        Game.loadTexture(texSpider, 'spider'),
        Game.loadTexture(texBeekeeper, 'beekeeper'),
        Game.loadTexture(texCat, 'cat'),
        Game.loadTexture(texRat, 'rat'),
        Game.loadTexture(texBackgrounds, 'backgrounds', { framesX: 4 }),
        Game.loadTexture(texBeehiveBackground, 'beehiveBackground'),
        Game.loadTexture(texBeehiveForeground, 'beehiveForeground'),
        Game.loadTexture(texMenuButton, 'menuButton'),
        Game.loadTexture(texTitle, 'title'),
        loadDictionary('de').then(dict => Game.dictionaries.de = dict),
        loadDictionary('en').then(dict => Game.dictionaries.en = dict),
        new Promise((resolve) => {
            preloadFont({ font: fontOswald }, () => resolve());
        }),
        new Promise((resolve) => {
            preloadFont({ font: fontTiltPrism }, () => resolve());
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