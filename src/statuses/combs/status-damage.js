import Buff from "./buff.js";

const DAMAGE_MULTIPLIER = 5;

const StatusDamage = {
    apply: (comb, sprite) => {
        return new Buff(comb, sprite, 0x7f3f00, 0, () => {}, (comb, multiplier) => {
            comb.damage *= DAMAGE_MULTIPLIER * (multiplier ?? 1);
        });
    }
}

export default StatusDamage;