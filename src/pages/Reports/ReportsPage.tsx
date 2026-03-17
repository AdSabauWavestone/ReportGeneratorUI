import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/Card';
import { Icon } from '@/components/common/Icon';
import { Modal } from '@/components/common/Modal';
import type { Report } from '@/types/report.types';
import { storage } from '@/utils/storage';
import styles from './ReportsPage.module.css';

function getStatusVariant(status: Report['status']) {
  if (status === 'draft') return 'outline' as const;
  if (status === 'in-progress') return 'secondary' as const;
  return 'default' as const;
}

function getStatusIcon(status: Report['status']) {
  if (status === 'draft') return 'edit_document';
  if (status === 'in-progress') return 'schedule';
  return 'check_circle';
}

export function ReportsPage() {
  const { t } = useTranslation();
  const [reports, setReports] = useState(storage.getReports());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sortedReports = useMemo(
    () => [...reports].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
    [reports],
  );

  const deleteReport = () => {
    if (!deleteId) return;
    storage.deleteReport(deleteId);
    setReports(storage.getReports());
    setDeleteId(null);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerRow}>
            <Link to="/"><Button variant="ghost" size="sm"><Icon name="arrow_back" />{t('common.back')}</Button></Link>
            <div>
              <h1 className={styles.title}>{t('reports.allReports')}</h1>
              <p className={styles.subtitle}>{t('reports.manageSubtitle')}</p>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.container}>
        <div className={styles.contentWrap}>
          {sortedReports.length === 0 ? (
            <Card>
              <CardContent className={styles.emptyState}>
                <Icon name="description" className={styles.emptyIcon} />
                <h3 className={styles.emptyTitle}>{t('reports.noReportsFound')}</h3>
                <p className={styles.emptyText}>{t('reports.noReportsSubtitle')}</p>
                <Link to="/new-bank-report"><Button>{t('dashboard.createNewReport')}</Button></Link>
              </CardContent>
            </Card>
          ) : (
            <div className={styles.list}>
              {sortedReports.map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <div className={styles.cardTop}>
                      <div className={styles.cardTopLeft}>
                        <div className={styles.fileIconWrap}><Icon name="description" className={styles.fileIcon} /></div>
                        <div>
                          <CardTitle>{report.title}</CardTitle>
                          <CardDescription>{t('reports.createdOn', { date: report.createdAt.toLocaleDateString() })}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={getStatusVariant(report.status)}>
                        <Icon name={getStatusIcon(report.status)} />
                        {t(`status.${report.status}`)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={styles.cardBottom}>
                      <div className={styles.meta}>
                        <span>{t('reports.fileCount', { count: report.uploadedFiles.length })}</span>
                        <span>{t('reports.versionCount', { count: report.versions.length })}</span>
                        <span>
                          {t('dashboard.lastUpdatedAt', {
                            date: report.updatedAt.toLocaleDateString(),
                            time: report.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          })}
                        </span>
                      </div>
                      <div className={styles.actions}>
                        <Link to={`/report/${report.id}`}><Button variant="outline">{t('reports.openReport')}</Button></Link>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(report.id)} aria-label={t('reports.deleteReport')}>
                          <Icon name="delete" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title={t('reports.deleteDialogTitle')}>
        <p className={styles.dialogText}>{t('reports.deleteDialogText')}</p>
        <div className={styles.dialogActions}>
          <Button variant="outline" onClick={() => setDeleteId(null)}>{t('common.cancel')}</Button>
          <Button variant="danger" onClick={deleteReport}>{t('common.delete')}</Button>
        </div>
      </Modal>
    </div>
  );
}
