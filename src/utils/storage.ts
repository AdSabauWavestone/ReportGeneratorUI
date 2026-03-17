import type { Report } from '@/types/report.types';

const STORAGE_KEY = 'regulatory-reports';

export const storage = {
  getReports(): Report[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const reports = JSON.parse(data) as Array<any>;
      return reports.map((report) => ({
        ...report,
        createdAt: new Date(report.createdAt),
        updatedAt: new Date(report.updatedAt),
        uploadedFiles: (report.uploadedFiles ?? []).map((file: any) => ({
          ...file,
          uploadedAt: new Date(file.uploadedAt),
        })),
        referenceDocument: report.referenceDocument
          ? { ...report.referenceDocument, uploadedAt: new Date(report.referenceDocument.uploadedAt) }
          : undefined,
        versions: (report.versions ?? []).map((version: any) => ({
          ...version,
          timestamp: new Date(version.timestamp),
        })),
      }));
    } catch (error) {
      console.error('Error loading reports:', error);
      return [];
    }
  },

  getReport(id: string): Report | undefined {
    return this.getReports().find((report) => report.id === id);
  },

  saveReport(report: Report): void {
    const reports = this.getReports();
    const index = reports.findIndex((entry) => entry.id === report.id);
    if (index >= 0) {
      reports[index] = report;
    } else {
      reports.push(report);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  },

  deleteReport(id: string): void {
    const reports = this.getReports().filter((entry) => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  },
};
