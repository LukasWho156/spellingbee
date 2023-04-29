import { THREE } from "luthe-amp";
import { MouseInteractionComponent } from "luthe-amp/lib/input/mouse-interaction-component";

import Popup from "../../util/popup.js";
import createInfoPopup from "./info-popup.js";

const GROWTH_RATE = 0.005;

const createFlowerPopup = async (scene, flower, mis, messenger) => {

    return await createInfoPopup(
        scene,
        `flowerHeading_${flower.id}`,
        `flowerInfo_${flower.id}`,
        'flowers',
        flower.frame,
        mis,
        messenger
    );

}

export default createFlowerPopup;