import dictionaryDE from './dictionary.de.json';
import dictionaryEN from './dictionary.en.json';

const dictionaries = {
    'de': dictionaryDE,
    'en': dictionaryEN,
}

class BST {
    
    value;
    left;
    right;

    constructor(list) {
        const index = Math.floor(list.length / 2);
        this.value = list[index];
        const leftList = list.slice(0, index);
        const rightList = list.slice(index + 1);
        if(leftList.length > 0) this.left = new BST(leftList);
        if(rightList.length > 0) this.right = new BST(rightList);
        //console.log("bst", this.value, leftList.length, rightList.length);
    }

    find(value) {
        if(this.value === value) {
            return this.value;
        }
        if(this.value < value) {
            return this.right?.find(value);
        }
        return this.left?.find(value);
    }

}

const loadDictionary = async (language) => {
    const dictionary = await (await fetch(dictionaries[language])).json();
    dictionary.sort();
    return new BST(dictionary);
}

export default loadDictionary;