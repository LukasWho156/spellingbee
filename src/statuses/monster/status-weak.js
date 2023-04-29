const StatusWeak = {
    id: 'weak',
    color: 0xaf00af,
    intent: 22,
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