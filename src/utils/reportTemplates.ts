import i18n from '@/i18n';
import reportTemplates from '@/resources/reportTemplates.json';
import type { Chapter, ReportContent, ReportType } from '@/types/report.types';

type TemplateDefinition = {
  defaultTitleKey: string;
  currentChapterId: string;
  versionNoteKey: string;
  requiredDocuments: string[];
  chapters: Chapter[];
};

const templates = reportTemplates as Record<ReportType, TemplateDefinition>;

export function getReportTemplate(type: ReportType): TemplateDefinition {
  return templates[type];
}

export function getReportStructure(type: ReportType): Chapter[] {
  return getReportTemplate(type).chapters;
}

export function getRequiredDocuments(type: ReportType): string[] {
  return getReportTemplate(type).requiredDocuments;
}

function collectContentEntries(chapters: Chapter[], entries: ReportContent = {}): ReportContent {
  for (const chapter of chapters) {
    if (chapter.contentKey) {
      entries[chapter.id] = {
        text: i18n.t(chapter.contentKey),
        lastEdited: new Date(),
      };
    }

    if (chapter.children?.length) {
      collectContentEntries(chapter.children, entries);
    }
  }

  return entries;
}

export function generateTemplateContent(type: ReportType): ReportContent {
  return collectContentEntries(getReportStructure(type));
}
