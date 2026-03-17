import type { Chapter, ReportContent, ReportType } from "@/types/report.types";
import {
  getTemplateRoot,
  type ParsedSection,
} from "@/utils/reportTemplateParser";

export type TemplateDefinition = {
  defaultTitle: string;
  currentChapterId: string;
  versionNoteKey: string;
  requiredDocuments: string[];
  chapters: Chapter[];
};

const TEMPLATE_NAME_BY_TYPE: Record<ReportType, string> = {
  bank: "Sanierungsplan für Finanzinstitute",
  insurance: "Sanierungsplan für Finanzinstitute",
};

function mapParsedSectionToChapter(section: ParsedSection): Chapter {
  return {
    id: section.id,
    title: section.title,
    content: section.content,
    children: section.children.map(mapParsedSectionToChapter),
  };
}

function collectContentEntries(
  chapters: Chapter[],
  entries: ReportContent = {},
): ReportContent {
  for (const chapter of chapters) {
    entries[chapter.id] = {
      text: chapter.content ?? "",
      lastEdited: new Date(),
    };

    if (chapter.children?.length) {
      collectContentEntries(chapter.children, entries);
    }
  }

  return entries;
}

function findInitialChapterId(chapters: Chapter[]): string {
  if (!chapters.length) return "overview";

  const firstChapter = chapters[0];
  if (firstChapter.children?.length) {
    return firstChapter.children[0]?.id ?? firstChapter.id;
  }

  return firstChapter.id;
}

function collectRequiredDocuments(chapters: Chapter[]): string[] {
  const tableOfContents = chapters.find(
    (chapter) => chapter.title === "Inhaltsverzeichnis",
  );

  if (tableOfContents?.children?.length) {
    return tableOfContents.children.map((child) => child.title);
  }

  return chapters.map((chapter) => chapter.title);
}

export function getReportTemplate(type: ReportType): TemplateDefinition {
  const templateName = TEMPLATE_NAME_BY_TYPE[type];
  const root = getTemplateRoot(templateName);

  if (!root) {
    return {
      defaultTitle: templateName,
      currentChapterId: "overview",
      versionNoteKey: "reports.initialDraftGenerated",
      requiredDocuments: [],
      chapters: [],
    };
  }

  const chapters = root.children.map(mapParsedSectionToChapter);

  return {
    defaultTitle: root.title,
    currentChapterId: findInitialChapterId(chapters),
    versionNoteKey: "reports.initialDraftGenerated",
    requiredDocuments: collectRequiredDocuments(chapters),
    chapters,
  };
}

export function getReportStructure(type: ReportType): Chapter[] {
  return getReportTemplate(type).chapters;
}

export function getRequiredDocuments(type: ReportType): string[] {
  return getReportTemplate(type).requiredDocuments;
}

export function generateTemplateContent(type: ReportType): ReportContent {
  return collectContentEntries(getReportStructure(type));
}
