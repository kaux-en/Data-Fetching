import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/enTranslation.json'
import esTranslation from './locales/es/esTranslation.json';


i18n
    .use(initReactI18next) 
    
    
    .init({
        
        lng: 'en',
        fallbacking: 'en',
        debug: true, 
       
        resources: {
            en: {
                translation: enTranslation
            },
            es: {
                translation: esTranslation
            }
        },
        
        backend: {
            loadpath: '/locales/{{lng}}/Translation.json'
        },
        interpolation: {
            escapeValue: false, //not needed for react as it escapes by default
        },
    });

export default i18n;