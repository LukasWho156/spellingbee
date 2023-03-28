import { getLetterFreqs } from "../language/get-random-letter.js";

const Edelweiss = {

    id: 'edelweiss',
    frame: 9,

    onCombDamage: (comb) => {
        const freqs = Object.entries(getLetterFreqs());
        freqs.sort((a, b) => a[1] - b[1]);
        const i = freqs.findIndex(f => f[0] === comb.letter);
        if(i >= 0 && i < 10) {
            comb.damage *= 2;
        }
    }

}

export default Edelweiss;