import { Game } from 'luthe-amp';
import letterFreqsDE from './letter-freqs.de.json';
import letterFreqsEN from './letter-freqs.en.json';

const FREQS = {
    de: letterFreqsDE,
    en: letterFreqsEN,
}

const getRandomLetter = () => {
    const letterFreqs = FREQS[Game.settings.playingLanguage];
    let value = Math.random();
    for(const [letter, frequency] of Object.entries(letterFreqs)) {
        if(value < frequency) {
            return letter;
        }
        value -= frequency;
    }
    return "?"; // should never be reached!
}

const getLetterFreqs = () => {
    const letterFreqs = letterFreqsDE;
    return letterFreqs;
}

export { getRandomLetter, getLetterFreqs };