export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export interface ChapterContent {
  text: string;
  lastEdited?: Date;
}

export interface ReportContent {
  [chapterId: string]: ChapterContent;
}

export interface ReportVersion {
  id: string;
  timestamp: Date;
  content: ReportContent;
  note?: string;
}

export type ReportStatus = 'draft' | 'in-progress' | 'completed';
export type ReportType = 'insurance' | 'bank';

export interface Report {
  id: string;
  title: string;
  type?: ReportType;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
  uploadedFiles: UploadedFile[];
  referenceDocument?: UploadedFile;
  content: ReportContent;
  currentChapter: string;
  versions: ReportVersion[];
}

export interface Chapter {
  id: string;
  titleKey: string;
  contentKey?: string;
  children?: Chapter[];
}

export interface ReportItem {
  id: string;
  title: string;
  status: ReportStatus;
  updatedAt: string;
}

export interface CreateReportPayload {
  title: string;
}
