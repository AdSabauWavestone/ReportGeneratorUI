import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Textarea } from "@/components/common/Field";
import { Icon } from "@/components/common/Icon";
import { Modal } from "@/components/common/Modal";
import { pushSuccess } from "@/services/http/apiMessages";
import type { Chapter, Report } from "@/types/report.types";
import { getReportStructure } from "@/utils/reportTemplates";
import { storage } from "@/utils/storage";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./ReportEditorPage.module.css";

function findChapter(chapters: Chapter[], chapterId: string): Chapter | null {
  for (const chapter of chapters) {
    if (chapter.id === chapterId) return chapter;
    const child = chapter.children
      ? findChapter(chapter.children, chapterId)
      : null;
    if (child) return child;
  }
  return null;
}

function collectChapterIds(chapters: Chapter[]): string[] {
  return chapters.flatMap((chapter) => [
    chapter.id,
    ...(chapter.children ? collectChapterIds(chapter.children) : []),
  ]);
}

export function ReportEditorPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [selectedChapter, setSelectedChapter] = useState("executive-summary");
  const [draftText, setDraftText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showVersions, setShowVersions] = useState(false);

  const reportStructure = useMemo(
    () => getReportStructure(report?.type ?? "insurance"),
    [report?.type],
  );
  const chapterIds = useMemo(
    () => collectChapterIds(reportStructure),
    [reportStructure],
  );

  useEffect(() => {
    if (!id) return;
    const loadedReport = storage.getReport(id);
    if (!loadedReport) return;
    setReport(loadedReport);
    const currentChapter = loadedReport.currentChapter || "executive-summary";
    setSelectedChapter(currentChapter);
    setDraftText(loadedReport.content[currentChapter]?.text ?? "");
  }, [id]);

  useEffect(() => {
    if (!report) return;
    setDraftText(report.content[selectedChapter]?.text ?? "");
  }, [selectedChapter, report]);

  const currentTitle = useMemo(() => {
    const chapter = findChapter(reportStructure, selectedChapter);
    return chapter ? t(chapter.titleKey) : "";
  }, [reportStructure, selectedChapter, t]);

  const updateCurrentChapter = () => {
    if (!report) return report;
    return {
      ...report,
      currentChapter: selectedChapter,
      content: {
        ...report.content,
        [selectedChapter]: { text: draftText, lastEdited: new Date() },
      },
      updatedAt: new Date(),
      status: "in-progress" as const,
    };
  };

  const saveReport = async () => {
    if (!report) return;
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const updated = updateCurrentChapter();
    if (!updated) return;
    updated.versions = [
      ...updated.versions,
      {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        content: updated.content,
        note: t("reportEditor.savedChangesTo", { chapter: currentTitle }),
      },
    ];
    storage.saveReport(updated);
    setReport(updated);
    setIsSaving(false);
    pushSuccess(t("reportEditor.reportSaved"));
  };

  if (!report) {
    return (
      <div className={styles.loadingPage}>
        <Card className={styles.loadingCard}>
          {t("reportEditor.reportNotFound")}{" "}
          <Link to="/">{t("reportEditor.goBack")}</Link>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            aria-label={t("reportEditor.goHome")}
          >
            <Icon name="home" />
          </Button>
          <div className={styles.toolbarSeparator} />
          <div>
            <h2 className={styles.reportTitle}>{report.title}</h2>
            <p className={styles.reportMeta}>
              {t("reportEditor.lastSavedAt", {
                time: report.updatedAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              })}
            </p>
          </div>
        </div>
        <div className={styles.toolbarActions}>
          <Badge variant="secondary">{t(`status.${report.status}`)}</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVersions(true)}
          >
            <Icon name="history" />
            {t("reportEditor.versions", { count: report.versions.length })}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={saveReport}
            disabled={isSaving}
          >
            <Icon name={isSaving ? "hourglass_top" : "save"} />
            {isSaving ? t("reportEditor.saving") : t("reportEditor.save")}
          </Button>
          <Button size="sm">
            <Icon name="download" />
            {t("reportEditor.export")}
          </Button>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <div className={styles.sidebarHeader}>
              <Icon name="description" />
              <h3 className={styles.sidebarTitle}>
                {t("reportEditor.reportStructure")}
              </h3>
            </div>
            {report.referenceDocument ? (
              <div className={styles.referenceCard}>
                <p className={styles.referenceLabel}>
                  {t("reportEditor.structureFrom")}
                </p>
                <p className={styles.referenceName}>
                  {report.referenceDocument.name}
                </p>
              </div>
            ) : null}
            <nav className={styles.chapterNav}>
              {reportStructure.map((chapter) => (
                <div key={chapter.id}>
                  <button
                    type="button"
                    className={
                      selectedChapter === chapter.id
                        ? `${styles.chapterButton} ${styles.chapterButtonActive}`
                        : styles.chapterButton
                    }
                    onClick={() => setSelectedChapter(chapter.id)}
                  >
                    {t(chapter.titleKey)}
                  </button>
                  {chapter.children?.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      className={
                        selectedChapter === child.id
                          ? `${styles.childButton} ${styles.chapterButtonActive}`
                          : styles.childButton
                      }
                      onClick={() => setSelectedChapter(child.id)}
                    >
                      {t(child.titleKey)}
                    </button>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <main className={styles.editorArea}>
          <div className={styles.editorInner}>
            <div className={styles.editorHeader}>
              <div>
                <p className={styles.editorEyebrow}>
                  {t("reportEditor.currentChapter")}
                </p>
                <h1 className={styles.editorTitle}>{currentTitle}</h1>
              </div>
              <div className={styles.chapterProgress}>
                {t("reportEditor.chapterProgress", {
                  current: chapterIds.indexOf(selectedChapter) + 1,
                  total: chapterIds.length,
                })}
              </div>
            </div>
            <Textarea
              value={draftText}
              onChange={(event) => setDraftText(event.target.value)}
              className={styles.editorTextarea}
            />
          </div>
        </main>
      </div>

      <Modal
        open={showVersions}
        onClose={() => setShowVersions(false)}
        title={t("reportEditor.versionHistory")}
      >
        <div className={styles.versionList}>
          {[...report.versions].reverse().map((version) => (
            <div key={version.id} className={styles.versionRow}>
              <div>
                <strong className={styles.versionTitle}>
                  {version.note ?? t("reportEditor.savedVersion")}
                </strong>
                <p className={styles.versionMeta}>
                  {t("reportEditor.versionTimestamp", {
                    date: version.timestamp.toLocaleDateString(),
                    time: version.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
