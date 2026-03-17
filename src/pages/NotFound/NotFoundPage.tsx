import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card, CardContent } from '@/components/common/Card';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <Card>
        <CardContent className={styles.content}>
          <h1 className={styles.title}>{t('notFound.title')}</h1>
          <p className={styles.text}>{t('notFound.message')}</p>
          <Link to="/"><Button>{t('notFound.backHome')}</Button></Link>
        </CardContent>
      </Card>
    </div>
  );
}
