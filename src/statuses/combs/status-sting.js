import StatusVulnerable from "../monster/status-vulnerable.js";
import Buff from "./buff.js";

const STING_TIME = 10_000;

const StatusSting = {
    apply: (comb, sprite) => {
        return new Buff(comb, sprite, 0x7f0000, 3, (messenger, multiplier) => {
            const time = STING_TIME * multiplier
            messenger.applyStatusToMonster(StatusVulnerable, time);
        });
    }
}

export default StatusSting;