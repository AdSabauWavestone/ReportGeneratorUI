import { Button } from "@/components/common/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";
import { Input, Label } from "@/components/common/Field";
import { Icon } from "@/components/common/Icon";
import { pushError, pushSuccess } from "@/services/http/apiMessages";
import type { Report, ReportType, UploadedFile } from "@/types/report.types";
import { generateMockContent } from "@/utils/mockData";
import {
  getReportTemplate,
  getRequiredDocuments,
} from "@/utils/reportTemplates";
import { storage } from "@/utils/storage";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "./NewReportPage.module.css";

function formatFileSize(
  bytes: number,
  t: (key: string, options?: Record<string, unknown>) => string,
) {
  if (bytes === 0) return t("files.sizeBytes", { value: 0 });
  const units = ["Bytes", "KB", "MB", "GB"] as const;
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return t(`files.sizeUnit.${units[index]}`, {
    value: Math.round((bytes / 1024 ** index) * 100) / 100,
  });
}

export function NewReportPage({
  reportType = "insurance",
}: {
  reportType?: ReportType;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const template = getReportTemplate(reportType);
  const requiredDocuments = getRequiredDocuments(reportType);

  const [title, setTitle] = useState(template.defaultTitle);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [referenceDocument, setReferenceDocument] =
    useState<UploadedFile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const pageTitle = useMemo(
    () =>
      t(
        reportType === "bank"
          ? "newReport.createBankTitle"
          : "newReport.createInsuranceTitle",
      ),
    [reportType, t],
  );

  const addFiles = (selectedFiles: FileList | null, reference = false) => {
    if (!selectedFiles?.length) return;
    const uploadedFiles = Array.from(selectedFiles).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
    }));
    if (reference) {
      setReferenceDocument(uploadedFiles[0] ?? null);
      return;
    }
    setFiles((current) => [...current, ...uploadedFiles]);
  };

  const createReport = async () => {
    if (!title.trim()) {
      pushError(t("newReport.validationTitleRequired"));
      return;
    }

    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 900));

    const content = generateMockContent(reportType);
    const report: Report = {
      id: crypto.randomUUID(),
      title: title.trim(),
      type: reportType,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      uploadedFiles: files,
      referenceDocument: referenceDocument ?? undefined,
      content,
      currentChapter: template.currentChapterId,
      versions: [
        {
          id: crypto.randomUUID(),
          timestamp: new Date(),
          content,
          note: t(template.versionNoteKey),
        },
      ],
    };

    storage.saveReport(report);
    pushSuccess(t("newReport.generatedSuccess"));
    navigate(`/report/${report.id}`);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerRow}>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <Icon name="arrow_back" />
              {t("newReport.backToDashboard")}
            </Button>
            <div className={styles.separator} />
            <div>
              <h1 className={styles.title}>{pageTitle}</h1>
              <p className={styles.subtitle}>{t("newReport.subtitle")}</p>
            </div>
          </div>
        </div>
      </header>
      <main className={styles.container}>
        <div className={styles.stack}>
          <Card>
            <CardHeader>
              <CardTitle>{t("newReport.reportInformationTitle")}</CardTitle>
              <CardDescription>
                {t("newReport.reportInformationDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="report-title">
                {t("newReport.reportTitleLabel")}
              </Label>
              <Input
                id="report-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={template.defaultTitle}
              />
            </CardContent>
          </Card>

          {requiredDocuments.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>{t("newReport.requiredSectionsTitle")}</CardTitle>
                <CardDescription>
                  {t("newReport.requiredSectionsDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={styles.fileList}>
                  {requiredDocuments.map((item, index) => (
                    <div key={item} className={styles.fileRow}>
                      <div className={styles.fileRowLeft}>
                        <span
                          style={{
                            width: 24,
                            color: "var(--color-text-muted)",
                          }}
                        >
                          {index + 1}.
                        </span>
                        <p className={styles.fileName}>{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>{t("newReport.referenceDocumentTitle")}</CardTitle>
              <CardDescription>
                {t("newReport.referenceDocumentDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.uploaderCardContent}>
              <label className={styles.uploadBox}>
                <input
                  type="file"
                  className={styles.hiddenInput}
                  onChange={(event) => addFiles(event.target.files, true)}
                />
                <Icon name="upload_file" className={styles.uploadIcon} />
                <p className={styles.uploadText}>
                  {referenceDocument
                    ? referenceDocument.name
                    : t("newReport.referenceUploadPrompt")}
                </p>
                <p className={styles.uploadSubtext}>
                  {t("newReport.referenceUploadHelper")}
                </p>
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("newReport.supportingDocumentsTitle")}</CardTitle>
              <CardDescription>
                {t("newReport.supportingDocumentsDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.uploaderCardContent}>
              <label className={styles.uploadBox}>
                <input
                  type="file"
                  multiple
                  className={styles.hiddenInput}
                  onChange={(event) => addFiles(event.target.files)}
                />
                <Icon name="cloud_upload" className={styles.uploadIcon} />
                <p className={styles.uploadText}>
                  {t("newReport.supportingUploadPrompt")}
                </p>
                <p className={styles.uploadSubtext}>
                  {t("newReport.supportingUploadHelper")}
                </p>
              </label>

              {files.length > 0 ? (
                <div className={styles.fileList}>
                  {files.map((file) => (
                    <div key={file.id} className={styles.fileRow}>
                      <div className={styles.fileRowLeft}>
                        <div className={styles.fileIconWrap}>
                          <Icon name="description" />
                        </div>
                        <div>
                          <p className={styles.fileName}>{file.name}</p>
                          <p className={styles.fileMeta}>
                            {formatFileSize(file.size, t)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setFiles((current) =>
                            current.filter((entry) => entry.id !== file.id),
                          )
                        }
                      >
                        {t("common.remove")}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <div className={styles.footerActions}>
            <Button variant="outline" onClick={() => navigate("/")}>
              {t("common.cancel")}
            </Button>
            <Button onClick={createReport} disabled={isGenerating}>
              <Icon name={isGenerating ? "hourglass_top" : "auto_awesome"} />
              {isGenerating
                ? t("newReport.generating")
                : t("newReport.generateReport")}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
