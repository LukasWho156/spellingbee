const drawFromArray = (array, amount) => {
    const copy = [...array];
    const result = [];
    for(let i = 0; i < amount; i++) {
        const drawnIndex = Math.floor(Math.random() * copy.length);
        result.push(copy[drawnIndex]);
        copy.splice(drawnIndex, 1);
    }
    return result;
}

export default drawFromArray;