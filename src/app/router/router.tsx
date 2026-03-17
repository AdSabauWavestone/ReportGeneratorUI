import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { BankReportPage } from '@/pages/BankReport/BankReportPage';
import { DashboardPage } from '@/pages/Dashboard/DashboardPage';
import { NewReportPage } from '@/pages/NewReport/NewReportPage';
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage';
import { ReportEditorPage } from '@/pages/ReportEditor/ReportEditorPage';
import { ReportsPage } from '@/pages/Reports/ReportsPage';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'new-report', element: <NewReportPage /> },
      { path: 'new-bank-report', element: <BankReportPage /> },
      { path: 'report/:id', element: <ReportEditorPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
