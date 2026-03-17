import { useTranslation } from 'react-i18next';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Modal } from '@/components/common/Modal';
import styles from './ReportTypeModal.module.css';

export function ReportTypeModal({
  open,
  onClose,
  onSelectType,
}: {
  open: boolean;
  onClose: () => void;
  onSelectType: (type: 'bank' | 'insurance') => void;
}) {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose} title={t('reportTypeModal.title')}>
      <div className={styles.grid}>
        <button type="button" className={styles.option} disabled aria-disabled="true">
          <span className={styles.optionIcon}><Icon name="shield" /></span>
          <span>
            <strong className={styles.optionTitle}>{t('reportTypeModal.insuranceTitle')}</strong>
            <span className={styles.optionText}>{t('reportTypeModal.insuranceText')}</span>
            <span className={styles.optionText}>{t('reportTypeModal.insuranceDisabled')}</span>
          </span>
        </button>
        <button type="button" className={styles.option} onClick={() => onSelectType('bank')}>
          <span className={styles.optionIcon}><Icon name="account_balance" /></span>
          <span>
            <strong className={styles.optionTitle}>{t('reportTypeModal.bankTitle')}</strong>
            <span className={styles.optionText}>{t('reportTypeModal.bankText')}</span>
          </span>
        </button>
      </div>
      <div className={styles.footer}>
        <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
      </div>
    </Modal>
  );
}
