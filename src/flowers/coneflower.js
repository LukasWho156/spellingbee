const Coneflower = {

    id: 'coneflower',
    frame: 4,

    onDamageCalculation: (value, length) => {
        if(length >= 5) {
            value.value *= 1.2;
        }
    }

}

export default Coneflower;