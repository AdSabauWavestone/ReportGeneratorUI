import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/app.store';
import styles from './LanguageSwitcher.module.css';

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  return (
    <div className={styles.switcher} aria-label={t('languageSwitcher.label')}>
      <button
        type="button"
        className={language === 'en' ? `${styles.option} ${styles.optionActive}` : styles.option}
        onClick={() => setLanguage('en')}
        aria-label={t('languageSwitcher.english')}
      >
        {t('languageSwitcher.enShort')}
      </button>
      <button
        type="button"
        className={language === 'ro' ? `${styles.option} ${styles.optionActive}` : styles.option}
        onClick={() => setLanguage('ro')}
        aria-label={t('languageSwitcher.romanian')}
      >
        {t('languageSwitcher.roShort')}
      </button>
    </div>
  );
}
