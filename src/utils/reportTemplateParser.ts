import templateData from "../resources/reportTemplates.json";
import type {
  ReportTemplateNode,
  ReportTemplateTree,
} from "../types/reportTemplate";

export type ParsedSection = {
  id: string;
  title: string;
  content: string;
  children: ParsedSection[];
};

function isNode(value: unknown): value is ReportTemplateNode {
  return typeof value === "object" && value !== null && "content" in value;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-äöüß]/gi, "");
}

function parseNode(
  title: string,
  node: ReportTemplateNode,
  path = "",
): ParsedSection {
  const children: ParsedSection[] = [];

  for (const [key, value] of Object.entries(node)) {
    if (key === "content") continue;
    if (!isNode(value)) continue;

    children.push(parseNode(key, value, `${path}/${slugify(title)}`));
  }

  return {
    id: `${path}/${slugify(title)}`,
    title,
    content: node.content ?? "",
    children,
  };
}

export function getTemplateRoot(templateName: string): ParsedSection | null {
  const templates = templateData as ReportTemplateTree;
  const rootNode = templates[templateName];

  if (!rootNode) return null;

  return parseNode(templateName, rootNode);
}
