const Daisy = {

    id: 'daisy',
    frame: 1,

    onDamageCalculation: (value, length) => {
        if(length === 3) {
            value.value *= 1.2;
        }
    }

}

export default Daisy;