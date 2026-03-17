import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { Outlet } from "react-router-dom";
import styles from "./AppLayout.module.css";

export function AppLayout() {
  return (
    <div className={styles.shell}>
      <div className={styles.languageDock}>
        <LanguageSwitcher />
      </div>
      <Outlet />
    </div>
  );
}
