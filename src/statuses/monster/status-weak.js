const StatusWeak = {
    id: 'weak',
    color: 0x00afaf,
    intent: 13,
    priority: 2,
    apply: () => {
        return new Weak();
    }
}

class Weak {

    onAttackPlayer = (damage) => {
        damage.value = Math.floor(damage.value / 2);
    }

}

export default StatusWeak;