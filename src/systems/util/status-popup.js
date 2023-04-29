import createInfoPopup from "./info-popup.js";

const createStatusPopup = async (scene, status, mis, messenger) => {

    return await createInfoPopup(
        scene,
        `statusHeading_${status.id}`,
        `statusInfo_${status.id}`,
        'intents',
        status.intent,
        mis,
        messenger
    );

}

export default createStatusPopup;