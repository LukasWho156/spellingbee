import createInfoPopup from "./info-popup.js";

const createAttackPopup = async (scene, attack, mis, messenger) => {

    return await createInfoPopup(
        scene,
        `attackHeading_${attack.id ?? 'unknown'}`,
        `attackInfo_${attack.id ?? 'unknown'}`,
        'intents',
        attack.intent,
        mis,
        messenger,
        attack.replacements
    );

}

export default createAttackPopup;