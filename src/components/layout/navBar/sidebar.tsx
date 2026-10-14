import {
  LayoutDashboard,
  UserRoundPlus,
  ChartNoAxesColumn,
  Settings
} from "lucide-react";
import styles from "./navigation.module.css";
import type { NavProps } from "./navProps";

export default function Sidebar({
  activeView,
  onNavigate,
  onAddPatient
}: NavProps) {
  return (
    <aside
      className={styles.sidebar}
    >
      <nav aria-label="Main navigation">
        <button
          className={`${styles.navItem} ${
            activeView === "dashboard" ? styles.active : ""
          }`}
          onClick={() => onNavigate("dashboard")}
          disabled={activeView === "dashboard"}
        >
          <LayoutDashboard />
          <span>Dashboard</span>
        </button>

        <button
          className={styles.navItem}
          onClick={onAddPatient}
        >
          <UserRoundPlus />
          <span>Add Patient</span>
        </button>

        <button
          className={`${styles.navItem} ${
            activeView === "timeline" ? styles.active : ""
          }`}
          onClick={() => onNavigate("timeline")}
          disabled={activeView === "timeline"}
        >
          <ChartNoAxesColumn />
          <span>Timeline</span>
        </button>

        <button
          className={`${styles.navItem} ${
            activeView === "settings" ? styles.active : ""
          }`}
          onClick={() => onNavigate("settings")}
          disabled={activeView === "settings"}
        >
          <Settings />
          <span>Settings</span>
        </button>
      </nav>
    </aside>
  )
};