import { THREE } from "luthe-amp";
import { MouseInteractionComponent } from "luthe-amp/lib/input/mouse-interaction-component";

import createPopup from "../../util/popup.js";

const GROWTH_RATE = 0.005;

const createFlowerPopup = async (scene, flower, mis, messenger) => {

    let state = 'closed';
    let scale = 0;

    let renderedMenu;

    const backdrop = new THREE.Mesh(
        new THREE.PlaneGeometry(600, 1200),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0,
        })
    )
    backdrop.layers.disable(0);
    backdrop.position.z = 75;
    scene.add(backdrop);

    const open = () => {
        if(state !== 'closed') return;
        if(messenger) {
            if(messenger.isPaused()) return;
            messenger.pause();
        }
        state = 'opening';
        backdrop.layers.enable(0);
    }

    const menu = createPopup('popup', 559, 1140, 35, 15, mis);

    const close = () => {
        backdrop.material.opacity = 0;
        backdrop.layers.disable(0);
        renderedMenu.scale.set(0, 0, 1);
        scale = 0;
        if(messenger) messenger.unpause();
        state = 'closed';
    }

    const bdInteraction = new MouseInteractionComponent({}, backdrop);
    bdInteraction.addEventListener('click', close);
    mis.add(bdInteraction);

    await menu.addHeading(`flowerHeading_${flower.id}`);
    const sprite = menu.addSprite('flowers', 0.5);
    sprite.setFrame(flower.frame);
    await menu.addTextBlock(`flowerInfo_${flower.id}`);
    
    const resumeButton = menu.addButton('info_close');
    resumeButton.addEventListener('click', close);

    renderedMenu = menu.render();
    renderedMenu.position.z = 100;
    renderedMenu.scale.set(0, 0, 1);
    scene.add(renderedMenu);

    const system = {
        open: open,
        update: (delta) => {
            if(state === 'opening') {
                scale += GROWTH_RATE * delta;
                if(scale >= 1) {
                    scale = 1;
                    state = 'opened';
                }
                renderedMenu.scale.set(scale, scale, 1);
                backdrop.material.opacity = scale * 0.5;
            }
        }
    };

    return system;

}

export default createFlowerPopup;