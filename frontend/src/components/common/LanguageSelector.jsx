import React from 'react';
import { Globe, Check } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

export function LanguageSelector({ variant = 'default', className = '' }) {
  const { language, setLanguage, t } = useTranslation();

  return (
    <div className={`inline-flex items-center gap-1.5 p-1 rounded-xl bg-agri-cream border border-agri-sand ${className}`}>
      <div className="flex items-center gap-1 pl-2 pr-1 text-xs text-agri-forest/70">
        <Globe className="w-3.5 h-3.5 text-agri-leaf" />
        <span className="hidden sm:inline font-medium text-[11px]">{t('lang_select')}:</span>
      </div>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
          language === 'en'
            ? 'bg-agri-forest text-white shadow-xs'
            : 'text-agri-forest/70 hover:text-agri-forest hover:bg-white/60'
        }`}
        title="Switch to English (Default)"
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLanguage('ml')}
        className={`px-2.5 py-1 rounded-lg text-xs font-bold font-malayalam transition-all ${
          language === 'ml'
            ? 'bg-agri-forest text-white shadow-xs'
            : 'text-agri-forest/70 hover:text-agri-forest hover:bg-white/60'
        }`}
        title="മലയാളത്തിലേക്ക് മാറ്റുക (Switch to Malayalam)"
      >
        മലയാളം
      </button>
    </div>
  );
}

export default LanguageSelector;
