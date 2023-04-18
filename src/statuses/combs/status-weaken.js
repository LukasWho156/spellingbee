import StatusWeak from "../monster/status-weak.js";
import Buff from "./buff.js";

const WEAKEN_TIME = 15_000;

const StatusWeaken = {
    apply: (comb, sprite) => {
        return new Buff(comb, sprite, 0x7f007f, 3, (messenger, multiplier) => {
            const time = WEAKEN_TIME * multiplier
            messenger.applyStatusToMonster(StatusWeak, time);
        });
    }
}

export default StatusWeaken;