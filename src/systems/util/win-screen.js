import { THREE, Game } from "luthe-amp";

import PulseComponent from "../../systems/util/pulse-component.js";
import GrowthComponent from "../../systems/play-screen/growth-component.js";
import { renderH1 } from "../../util/text-util.js";

const CONFETTI_COLORS = [
    //0xcf3f3f,
    //0x3fcf3f,
    //0x3f3fcf,
    //0xcfcf3f,
    //0xcf3fcf,
    0xffff3f,
    0xffaf3f,
]

const addWinScreen = (screen, cb, signal) => {
    const winText = renderH1('playScreen_winMessage');
    winText.scale.set(0, 0, 1);
    winText.sync();
    screen.mainScene.add(winText);

    const winEntity = {
        state: 'idle',
        fullScale: 1,
        size: 0,
        pulseFrequency: 1 / 6_000,
        pulseAmplitude: 0.05,
    }
    const growthComponent = new GrowthComponent(winEntity, winText);
    const pulseComponent = new PulseComponent(winEntity, winText);

    const backdrop = new THREE.Mesh(
        new THREE.PlaneGeometry(Game.width, Game.height),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0,
        })
    );
    backdrop.position.z = 75;
    screen.mainScene.add(backdrop)

    screen.addSystem({update: (delta, globalTime) => {
        if(!signal.won) {
            return;
        }
        if(winEntity.state === 'idle') {
            screen.messenger?.pause();
            winEntity.state = 'growing';
            for(let i = 0; i < 200; i++) {
                screen.particleSystem.spawn(0, {
                    position: new THREE.Vector3(
                        Math.random() * 600 - 300,
                        (Math.pow(Math.random(), 2)) * 1500 + 800,
                        80
                    ),
                    velocity: new THREE.Vector3(
                        0,
                        -(Math.random() * 0.2 + 0.35),
                        0
                    ),
                    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
                    size: Math.random() * 0.25 + 0.25,
                    opacity: 0.7,
                    spin: Math.random() * 0.01 - 0.005,
                    blending: THREE.NormalBlending,
                });
            }
        }
        if(winEntity.state === 'growing') {
            growthComponent.update(delta);
        }
        if(winEntity.state === 'ready') {
            pulseComponent.update(delta, globalTime)
        }
        backdrop.material.opacity = winEntity.size * 0.5;
    }});

    screen.addListener('click', () => {
        if(winEntity.state !== 'ready') return;
        cb();
    })
}

export default addWinScreen;