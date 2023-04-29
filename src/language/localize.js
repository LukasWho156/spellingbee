import de from './messages.de.json';
import en from './messages.en.json';

const LANGUAGES = {
    de: { name: 'Deutsch', translations: de },
    en: { name: 'English', translations: en },
}

const localize = (key, language, ...replacements) => {
    let message = LANGUAGES[language]?.translations[key] ?? LANGUAGES['en'].translations[key];
    if(!message) {
        return 'Missing key';
    }
    for(let i = 0; i < replacements.length; i++) {
        message = message.replace(`{${i}}`, replacements[i])
    }
    return message;
}

export { LANGUAGES, localize };