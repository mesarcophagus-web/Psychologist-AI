import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './en.json';
import fr from './fr.json';
import es from './es.json';
import ru from './ru.json';

const LANG_KEY = '@psychai_language';

export async function initI18n() {
  let savedLang = 'en';
  try {
    const stored = await AsyncStorage.getItem(LANG_KEY);
    if (stored) savedLang = stored;
  } catch {}
  await i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      ru: { translation: ru },
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
}

export async function changeLanguage(lang: string) {
  await i18n.changeLanguage(lang);
  try { await AsyncStorage.setItem(LANG_KEY, lang); } catch {}
}

export default i18n;
