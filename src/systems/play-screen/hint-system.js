import { Game, THREE } from "luthe-amp";

const HintSystem = (combs, messenger, timerLength) => {

    let newCombs = false;
    let hints = [];
    let timer = timerLength;
    let particleTimer = 0;
    let currentWord = null;

    Game.wordFinder.onmessage = (event) => {
        const hint = event.data.combs.map(c1 => {
            return combs.find(c2 => c1.x === c2.x && c1.y === c2.y && c1.letter === c2.letter);
        });
        if(hint.find(c => !c)) return;
        if(hints.find(h2 => {
            for(let i = 0; i < hint.length; i++) {
                if(hint[i] !== h2[i]) return false;
            }
            return true;
        })) return;
        hints.push(hint);
    }

    const triggerReload = () => {
        newCombs = true;
        hints = hints.filter(hint => {
            return !hint.find(comb => comb?.state === 'removed');
        })
    }

    const triggerWordFound = () => {
        currentWord = null;
        timer = timerLength;
    }

    const updateCurrentWord = (delta) => {
        for(const comb of currentWord) {
            if(comb.state === 'removed') {
                timer = timerLength;
                currentWord = null;
                return;
            }
        }
        particleTimer -= delta;
        if(particleTimer <= 0) {
            for(const comb of currentWord) {
                messenger.spawnParticleOverComb(comb, {
                    frame: 6,
                    color: 0x3f3f7f,
                    size: Math.random() * 0.2 + 0.2,
                    growthRate: -0.0004,
                    fadeRate: 0.002,
                    blending: THREE.AdditiveBlending
                })
            }
        }
    }

    const update = (delta) => {
        if(newCombs) {
            Game.wordFinder.postMessage({ board: combs.map(comb => ({ x: comb.x, y: comb.y, letter: comb.letter})) });
            newCombs = false;
        }
        if(currentWord) {
            updateCurrentWord(delta);
        } else {
            timer -= delta;
            if(timer < 0 && hints.length > 0) {
                currentWord = hints[Math.floor(Math.random() * hints.length)];
            }
        }
    }

    return {
        update: update,
        triggerReload: triggerReload,
        triggerWordFound: triggerWordFound,
    }

}

export default HintSystem;