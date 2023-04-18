const StatusVulnerable = {
    color: 0xff3f3f,
    intent: 12,
    priority: 2,
    apply: () => {
        return new Vulnerable();
    }
}

class Vulnerable {

    onDamageCalculation = (damage) => {
        return Math.floor(damage * 1.5);
    }

}

export default StatusVulnerable;