import { THREE, Game } from "luthe-amp"
import { MouseInteractionSystem } from "luthe-amp/lib/input/mouse-interaction-system";
import { MouseInteractionComponent } from "luthe-amp/lib/input/mouse-interaction-component";
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";

import ConnectionShader from "../../shaders/connection-shader.js";

const makeTouchSystem = (screen, camera, boardSystem, evaluator, beehive, messenger) => {

    const system = new MouseInteractionSystem(Game.width, Game.height, camera, Game.renderer.domElement);
    screen.addSystem(system)

    const uniChain = new Array(20);
    for(let i = 0; i < 20; i++) {
        uniChain[i] = new THREE.Vector2(-1, -1);
    }

    let pointer = {
        down: false,
        x: 0,
        y: 0,
    }

    const _updateChain = () => {
        uniChain.forEach(v => v.set(-1, -1));
        boardSystem.chain.forEach((comb, i) => {
            uniChain[i].set(
                comb.rX / 600 + 0.5,
                comb.rY / 600 + 0.5,
            );
        });
        _updateTouch();
    }

    const _updateTouch = () => {
        if(pointer.down && boardSystem.chain.length > 0) {
            uniChain[boardSystem.chain.length].set(
                pointer.x / 600 + 0.5,
                pointer.y / 600 + 0.5,
            );
        }
    }

    const _handleTouch = (mX, mY) => {
        if(messenger.isPaused()) {
            return;
        }
        const {x, y} = boardSystem.mouseToBoard(mX, mY);
        pointer.down = true;
        pointer.x = x;
        pointer.y = y;
        const comb = boardSystem.findComb(x, y);
        if(comb) {
            if(comb.state === 'ready') {
                const lastComb = boardSystem.lastSelected;
                if(!lastComb) {
                    boardSystem.selectComb(comb);
                } else {
                    if(Math.abs(lastComb.x - comb.x) + Math.abs(lastComb.y - comb.y) < 2) {
                        boardSystem.selectComb(comb)
                    }
                }
            } else if(comb.state === 'selected') {
                const penComb = boardSystem.penultimateSelected;
                if(comb === penComb) {
                    boardSystem.deselectLatest();
                }
            }
        }
        _updateTouch();
    }

    const trailMat = new THREE.ShaderMaterial(ConnectionShader);
    trailMat.uniforms = {points: {type: 'v2v', value: uniChain}};
    trailMat.blending = THREE.AdditiveBlending
    trailMat.transparent = true;
    const trailMesh = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), trailMat);
    trailMesh.position.z = 20;
    boardSystem.board.add(trailMesh);

    const interaction = new MouseInteractionComponent({cursor: 'default'}, trailMesh);
    interaction.addEventListener('dragstart', (event) => {
        _handleTouch(event.detail.x, event.detail.y);
    });
    interaction.addEventListener('dragmove', (event) => {
        _handleTouch(event.detail.x, event.detail.y);
    });
    interaction.addEventListener('dragend', (event) => {
        if(!pointer.down) return
        pointer.down = false;
        evaluator.evaluateWord();
    });
    system.add(interaction);

    const rerollButton = new Sprite2D({
        texture: Game.getTexture('bee'),
        x: 250,
        y: 550,
        z: 25,
        scaleX: 0.5,
        scaleY: 0.5,
    });
    rerollButton.setFrame(1);
    beehive.add(rerollButton);
    const rerollInteraction = new MouseInteractionComponent({cursor: pointer}, rerollButton);
    rerollInteraction.addEventListener('dragstart', () => {
        boardSystem.startRerollTimer();
    });
    rerollInteraction.addEventListener('dragend', () => {
        boardSystem.stopRerollTimer();
    });
    system.add(rerollInteraction);

    boardSystem.addEventListener('selectionchanged', _updateChain);

    return system;

}

export default makeTouchSystem;