const Poppy = {

    id: 'poppy',
    frame: 6,

    onDamagePlayer: (damage) => {
        if(damage.value > 0) damage.value -= 1;
    }

}

export default Poppy;