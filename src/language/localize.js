import de from './messages.de.json';
import en from './messages.en.json';

const languages = {
    de: { name: 'Deutsch', translations: de },
    en: { name: 'English', translations: en },
}

const localize = (key, language, ...replacements) => {
    let message = languages[language]?.translations[key] ?? languages['en'].translations[key];
    if(!message) {
        return 'Missing key';
    }
    for(let i = 0; i < replacements.length; i++) {
        message = message.replace(`{${i}}`, replacements[i])
    }
    return message;
}

export default localize;