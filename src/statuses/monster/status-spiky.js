const StatusSpiky = {
    color: 0xafafaf,
    intent: 4,
    apply: () => {
        return new Spiky();
    }
}

class Spiky {

    onAttacked = (messenger) => {
        messenger.dealDamageToPlayer(2);
    }

}

export default StatusSpiky;