const Lily = {

    id: 'lily',
    frame: 5,

    onCombDamage: (comb) => {
        if(comb.ageStage === 3) {
            comb.damage *= 2;
        }
    }

}

export default Lily;