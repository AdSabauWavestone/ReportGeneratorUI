export type ReportTemplateNode = {
  content: string;
  [sectionTitle: string]: string | ReportTemplateNode;
};

export type ReportTemplateTree = Record<string, ReportTemplateNode>;
