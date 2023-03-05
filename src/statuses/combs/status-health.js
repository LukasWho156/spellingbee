import Buff from "./buff.js";

const HEAL_BASE = 15;

const StatusHealth = {
    apply: (comb, sprite) => {
        return new Buff(comb, sprite, 0x007f00, 1, (messenger, multiplier) => {
            const gain = HEAL_BASE * multiplier
            messenger.healPlayer(gain);
        });
    }
}

export default StatusHealth;