import type { ReportContent, ReportType } from '@/types/report.types';
import { generateTemplateContent } from './reportTemplates';

export const generateMockContent = (type: ReportType = 'insurance'): ReportContent => generateTemplateContent(type);
