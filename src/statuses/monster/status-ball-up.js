import StatusSpiky from "./status-spiky.js";

const StatusBallUp = {
    id: 'ballUp',
    color: 0xcfaf9f,
    intent: 29,
    priority: 0,
    apply: () => {
        return new BallUp();
    }
}

class BallUp {

    _stacks = 0;

    addStacks = (stacks) => {
        this._stacks += stacks;
    }

    getStacks = () => {
        return this._stacks;
    }

    onAttacked = (messenger) => {
        if(this._stacks > 1) {
            messenger.applyStatusToMonster(StatusBallUp, -1, -1);
        } else {
            messenger.applyStatusToMonster(StatusBallUp, -1, 4);
            messenger.applyStatusToMonster(StatusSpiky, 10_000, 10);
        }
    }

}

export default StatusBallUp;