import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/Card';
import styles from './SettingsPage.module.css';

export function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.title')}</CardTitle>
          <CardDescription>{t('settings.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={styles.stack}>
            <div>
              <h3 className={styles.heading}>{t('settings.i18nTitle')}</h3>
              <p className={styles.text}>{t('settings.i18nBody')}</p>
            </div>
            <div>
              <h3 className={styles.heading}>{t('settings.apiTitle')}</h3>
              <p className={styles.text}>{t('settings.apiBody')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
