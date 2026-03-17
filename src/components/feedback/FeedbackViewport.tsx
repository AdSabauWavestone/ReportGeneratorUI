import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeedbackStore } from '@/store/feedback.store';
import styles from './FeedbackViewport.module.css';

export function FeedbackViewport() {
  const { t } = useTranslation();
  const items = useFeedbackStore((state) => state.items);
  const remove = useFeedbackStore((state) => state.remove);

  useEffect(() => {
    const timers = items.map((item) =>
      window.setTimeout(() => {
        remove(item.id);
      }, 3500),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [items, remove]);

  return (
    <div className={styles.viewport} aria-live="polite" aria-atomic="true">
      {items.map((item) => (
        <div
          key={item.id}
          className={item.type === 'success' ? `${styles.toast} ${styles.success}` : `${styles.toast} ${styles.error}`}
        >
          <strong className={styles.label}>{item.type === 'success' ? t('feedback.successLabel') : t('feedback.errorLabel')}</strong>
          <p className={styles.message}>{item.message}</p>
        </div>
      ))}
    </div>
  );
}
