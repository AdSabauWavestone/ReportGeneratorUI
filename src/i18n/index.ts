import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from './locales/en/common.json';
import roCommon from './locales/ro/common.json';

void i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
    },
    ro: {
      common: roCommon,
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: ['en', 'ro'],
  defaultNS: 'common',
  ns: ['common'],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
