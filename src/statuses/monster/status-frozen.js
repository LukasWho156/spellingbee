const StatusFrozen = {
    color: 0x3fafff,
    intent: 5,
    apply: () => {
        return new Frozen();
    }
}

class Frozen {

    onApply = (messenger) => {
        const monster = messenger.getCurrentMonster();
        if(!monster) {
            return;
        }
        this._tempSpeed = monster.speedBonus;
        monster.speedBonus = 0;
    }

    onDie = (messenger) => {
        const monster = messenger.getCurrentMonster();
        if (!monster) {
            return;
        }
        monster.speedBonus = this._tempSpeed;
    }

}

export default StatusFrozen;