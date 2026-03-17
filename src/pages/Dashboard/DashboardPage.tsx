import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/Card';
import { Icon } from '@/components/common/Icon';
import { ReportTypeModal } from '@/components/report/ReportTypeModal';
import type { Report } from '@/types/report.types';
import { storage } from '@/utils/storage';
import styles from './DashboardPage.module.css';

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

export function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setReports(storage.getReports());
  }, []);

  const recentReports = useMemo(
    () => [...reports].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 5),
    [reports],
  );

  const statusCounts = {
    draft: reports.filter((report) => report.status === 'draft').length,
    'in-progress': reports.filter((report) => report.status === 'in-progress').length,
    completed: reports.filter((report) => report.status === 'completed').length,
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>{t('dashboard.platformTitle')}</h1>
              <p className={styles.subtitle}>{t('dashboard.platformSubtitle')}</p>
            </div>
            <Button size="lg" onClick={() => setShowModal(true)}>
              <Icon name="add" />
              {t('dashboard.createNewReport')}
            </Button>
          </div>
        </div>
      </header>

      <main className={styles.container}>
        <div className={styles.statsGrid}>
          <Card>
            <CardHeader className={styles.statHeader}>
              <CardTitle className={styles.statTitle}>{t('dashboard.draftReports')}</CardTitle>
              <Icon name="edit_document" className={styles.statIcon} />
            </CardHeader>
            <CardContent><div className={styles.statValue}>{statusCounts.draft}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className={styles.statHeader}>
              <CardTitle className={styles.statTitle}>{t('dashboard.inProgress')}</CardTitle>
              <Icon name="schedule" className={styles.statIcon} />
            </CardHeader>
            <CardContent><div className={styles.statValue}>{statusCounts['in-progress']}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className={styles.statHeader}>
              <CardTitle className={styles.statTitle}>{t('dashboard.completed')}</CardTitle>
              <Icon name="check_circle" className={styles.statIcon} />
            </CardHeader>
            <CardContent><div className={styles.statValue}>{statusCounts.completed}</div></CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className={styles.sectionHeader}>
              <div>
                <CardTitle>{t('dashboard.recentReports')}</CardTitle>
                <CardDescription>{t('dashboard.recentReportsSubtitle')}</CardDescription>
              </div>
              <Link to="/reports"><Button variant="outline">{t('dashboard.viewAll')}</Button></Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentReports.length === 0 ? (
              <div className={styles.emptyState}>
                <Icon name="description" className={styles.emptyIcon} />
                <h3 className={styles.emptyTitle}>{t('dashboard.noReportsYet')}</h3>
                <p className={styles.emptyText}>{t('dashboard.noReportsSubtitle')}</p>
                <Button onClick={() => setShowModal(true)}>
                  <Icon name="add" />
                  {t('dashboard.createNewReport')}
                </Button>
              </div>
            ) : (
              <div className={styles.reportList}>
                {recentReports.map((report) => (
                  <Link key={report.id} to={`/report/${report.id}`} className={styles.reportRow}>
                    <div className={styles.reportRowLeft}>
                      <div className={styles.fileIconWrap}><Icon name="description" className={styles.fileIcon} /></div>
                      <div>
                        <div className={styles.reportMetaRow}>
                          <h4 className={styles.reportTitle}>{report.title}</h4>
                          <Badge variant={getStatusVariant(report.status)}>
                            <Icon name={getStatusIcon(report.status)} />
                            {t(`status.${report.status}`)}
                          </Badge>
                        </div>
                        <p className={styles.reportSubtext}>
                          {t('dashboard.lastUpdatedAt', {
                            date: report.updatedAt.toLocaleDateString(),
                            time: report.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          })}
                        </p>
                      </div>
                    </div>
                    <div className={styles.reportAside}>
                      {t('reports.fileCount', { count: report.uploadedFiles.length })}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <ReportTypeModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSelectType={(type) => navigate(type === 'insurance' ? '/new-report' : '/new-bank-report')}
      />
    </div>
  );
}
