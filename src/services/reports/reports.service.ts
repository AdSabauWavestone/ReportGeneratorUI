import i18n from '@/i18n';
import { runWithApiFeedback } from '@/services/http/apiMessages';
import type { ReportItem } from '@/types/report.types';

export const reportsService = {
  async listReports(): Promise<ReportItem[]> {
    return runWithApiFeedback(
      async () => {
        await new Promise((resolve) => window.setTimeout(resolve, 250));
        return [
          {
            id: 'remote-1',
            title: i18n.t('templates.bank.defaultTitle'),
            status: 'in-progress',
            updatedAt: new Date().toISOString(),
          },
        ];
      },
      {
        errorMessage: i18n.t('feedback.reportLoadFailed'),
      },
    );
  },

  async createReport(payload: { title: string }): Promise<ReportItem> {
    return runWithApiFeedback(
      async () => {
        await new Promise((resolve) => window.setTimeout(resolve, 300));
        return {
          id: crypto.randomUUID(),
          title: payload.title,
          status: 'draft',
          updatedAt: new Date().toISOString(),
        };
      },
      {
        successMessage: i18n.t('feedback.reportCreateSuccess'),
        errorMessage: i18n.t('feedback.reportCreateFailed'),
      },
    );
  },
};
