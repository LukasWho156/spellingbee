import { THREE, Game, MouseInteractionComponent, Sprite2D } from "luthe-amp";
import { TextButton } from "../../util/button.js";
import createPopup from "../../util/popup.js";
import localize from "../../language/localize.js";
import { Text } from "troika-three-text";
import { getTextHeight, syncText } from "../../util/text-util.js";

const GROWTH_RATE = 0.005;

const pauseMenu = async (scene, top, mis, messenger, giveUp) => {

    let state = 'closed';
    let scale = 0;

    let renderedMenu;

    const menuButton = new Sprite2D({
        texture: 'menuButton',
        handle: 'top right',
        x: 300,
        y: -600,
        z: 5,
    });
    top.add(menuButton);

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

    const interaction = new MouseInteractionComponent({cursor: 'pointer'}, menuButton);
    interaction.addEventListener('click', () => {
        if(state !== 'closed') return;
        if(messenger) {
            if(messenger.isPaused()) return;
            messenger.pause();
        }
        state = 'opening';
        backdrop.layers.enable(0);
    });
    mis.add(interaction);

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

    await menu.addHeading('pauseMenu_heading');
    menu.addSpace(25);
    
    const resumeButton = menu.addButton('pauseMenu_resume');
    resumeButton.addEventListener('click', close);

    if(giveUp) {

        const confirmDialog = createPopup('popup', 559, 1140, 35, 15, mis);
        await confirmDialog.addHeading('abortConfirm_heading');
        confirmDialog.addSpace(25);
        await confirmDialog.addTextBlock('abortConfirm_description');
        const yesButton = confirmDialog.addButton('yes');
        const noButton = confirmDialog.addButton('no');
        const rendererdDialog = confirmDialog.render();
        rendererdDialog.position.z = 150;
        scene.add(rendererdDialog);
        const hidden = new THREE.Mesh(
            new THREE.PlaneGeometry(600, 1200),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0,
            })
        )
        hidden.position.z = -25;
        rendererdDialog.add(hidden);
        const hiddenInteraction = new MouseInteractionComponent({}, hidden);
        hiddenInteraction.addEventListener('click', () => rendererdDialog.scale.set(0, 0, 1));
        mis.add(hiddenInteraction);
        noButton.addEventListener('click', () => rendererdDialog.scale.set(0, 0, 1));
        yesButton.addEventListener('click', () => {
            rendererdDialog.scale.set(0, 0, 1);
            close();
            giveUp.callback();
        });
        rendererdDialog.scale.set(0, 0, 1);

        const giveUpButton = menu.addButton('pauseMenu_abort');
        giveUpButton.addEventListener('click', () => rendererdDialog.scale.set(1, 1, 1));

    } else {

        const mainMenuButton = menu.addButton('pauseMenu_mainMenu');
        mainMenuButton.addEventListener('click', () => {
            Game.setActiveScreen(Game.mainMenu);
        })

    }

    renderedMenu = menu.render();
    renderedMenu.position.z = 100;
    renderedMenu.scale.set(0, 0, 1);
    scene.add(renderedMenu);

    const system = {
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

export default pauseMenu