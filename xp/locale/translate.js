let translations = {};

export async function loadTranslations(lang) {
    const res = await fetch(`./locale/${lang}.json`);
    translations = await res.json();
    return translations;
}

export function getTranslation(key) {
    return translations[key] || '';
} 