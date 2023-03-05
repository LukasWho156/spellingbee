import { Game } from "luthe-amp";
import { getLetterFreqs } from "../../language/get-random-letter.js";

const MULTIPLIERS = [1, 1, 1, 1, 1, 1.2, 1.6, 2.2, 3.0, 4.0, 5.0];

class WordEval {

    _dictionary;

    _boardSystem;
    _messenger;

    constructor(board, messenger) {
        this._dictionary = Game.dictionary;
        this._boardSystem = board;
        this._messenger = messenger;
    }

    evaluateWord = () => {
        const word = this._boardSystem.selectedWord;
        if(word.length < 3) {
            this._boardSystem.deselectAll();
            return;
        }
        let isValid = false;
        if(word.includes('*')) {
            Object.keys(getLetterFreqs()).map(letter => word.replace('*', letter)).forEach(replaced => {
                if(!!this._dictionary.find(replaced)) {
                    isValid = true;
                }
            })
        } else {
            isValid = !!this._dictionary.find(word);
        }
        if(!isValid) {
            this._boardSystem.deselectAll();
            return;
        }
        this._boardSystem.acceptWord();
        this._messenger.triggerCombsBeforeAccept(this._boardSystem.chain);
        let multiplier = { value: this._getMultiplier(this._boardSystem.chain.length) };
        let damage = 0;
        for(const comb of this._boardSystem.chain) {
            if(comb.state === 'accepted') {
                damage += comb.damage;
            }
        }
        this._messenger.dealDamageToMonster(damage * multiplier.value);
        this._messenger.triggerMonsterAttacked();
        this._messenger.triggerCombsOnAccept(this._boardSystem.chain, multiplier.value);
        this._boardSystem.deselectAll();
    }

    /*
    evaluateKiss = () => {
        const kiss = this._kissSystem.selectKiss();
        if(kiss.good) {
            this._kissSystem.kissLuluagain()
        }

        this._messenger.kissLulu(kiss, love, knuddel)
    }
    */

    _getMultiplier = (wordLength) => {
        if(wordLength > MULTIPLIERS.length - 1) wordLength = MULTIPLIERS.length - 1;
        return MULTIPLIERS[wordLength];
    }

}

export default WordEval;