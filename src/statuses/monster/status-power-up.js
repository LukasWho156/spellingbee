const StatusPowerUp = {
    id: 'powerUp',
    color: 0x00afaf,
    intent: 13,
    priority: 2,
    apply: () => {
        return new PowerUp();
    }
}

class PowerUp {

    onAttackPlayer = (damage) => {
        damage.value = Math.floor(damage.value * 1.5);
    }

}

export default StatusPowerUp;