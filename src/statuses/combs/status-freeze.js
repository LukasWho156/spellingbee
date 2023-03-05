import StatusFrozen from "../monster/status-frozen.js";
import Buff from "./buff.js";

const FREEZE_TIME = 5_000;

const StatusFreeze = {
    apply: (comb, sprite) => {
        return new Buff(comb, sprite, 0x003f7f, 2, (messenger, multiplier) => {
            const time = FREEZE_TIME * multiplier
            messenger.applyStatusToMonster(StatusFrozen, time);
        });
    }
}

export default StatusFreeze;