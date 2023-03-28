const Sunflower = {

    id: 'sunflower',
    frame: 7,

    onRerollPrice: (price) => {
        price.value *= 0.8;
    }

}

export default Sunflower;