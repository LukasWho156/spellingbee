const findWords = (board, dictionary) => {
    for(let wordLength = 3; wordLength < board.length; wordLength++) {
        for(const comb of board) {
            addComb(board, comb, [], wordLength, dictionary)
        }
    }
}

const addComb = (board, comb, currentWord, wordLength, dictionary) => {
    currentWord.push(comb);
    if(currentWord.length === wordLength) {
        evaluateWord(currentWord, dictionary);
        currentWord.pop();
        return;
    }
    validNeighbours(board, comb, currentWord).forEach(next => {
        addComb(board, next, currentWord, wordLength, dictionary)
    });
    currentWord.pop();
}

const evaluateWord = (currentWord, dictionary) => {
    const word = currentWord.reduce((prev, cur) => prev + cur.letter, '');
    if(!!find(dictionary, word)) {
        postMessage({ word: word, combs: currentWord });
    };
}

const validNeighbours = (board, comb, currentWord) => {
    return board.filter(next => {
        if(next === comb) return false;
        if(Math.abs(next.x - comb.x) > 1 || Math.abs(next.y - comb.y) > 1) return false;
        if(currentWord.find(c => c === next)) return false;
        return true;
    });
}

const find = (dictionary, value) => {
    if(dictionary.value === value) {
        return value;
    }
    if(dictionary.value < value) {
        if(!dictionary.right) return null;
        return find(dictionary.right, value);
    }
    if(!dictionary.left) return null;
    return find(dictionary.left, value);
}

let dictionary;

onmessage = (event) => {
    findWords(event.data.board, event.data.dictionary);
}
