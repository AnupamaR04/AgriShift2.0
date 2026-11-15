import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from './translations';

export { TRANSLATIONS };

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  // English is the STRICT default per Requirement 1
  const [language, setLanguageState] = useState(() => {
    try {
      const stored = localStorage.getItem('agrishift_language');
      return stored === 'ml' ? 'ml' : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang) => {
    const valid = lang === 'ml' ? 'ml' : 'en';
    setLanguageState(valid);
    try {
      localStorage.setItem('agrishift_language', valid);
    } catch (e) {
      console.warn('Could not save language preference:', e);
    }
  };

  /**
   * Translate a key with optional dynamic variable interpolation
   * e.g. t('dash_subtitle') or t('hello_user', { name: 'Ramesh' })
   */
  const t = (key, params = {}) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let text = dict[key] || TRANSLATIONS.en[key] || key;
    if (params && typeof params === 'object') {
      Object.keys(params).forEach((paramKey) => {
        text = text.replace(new RegExp(`{${paramKey}}`, 'g'), params[paramKey]);
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isMalayalam: language === 'ml' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
