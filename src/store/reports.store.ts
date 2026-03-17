import { create } from 'zustand';
import type { ReportItem } from '@/types/report.types';

type ReportsState = {
  reports: ReportItem[];
  setReports: (reports: ReportItem[]) => void;
  addReport: (report: ReportItem) => void;
};

export const useReportsStore = create<ReportsState>((set) => ({
  reports: [],
  setReports: (reports) => set({ reports }),
  addReport: (report) => set((state) => ({ reports: [report, ...state.reports] })),
}));
