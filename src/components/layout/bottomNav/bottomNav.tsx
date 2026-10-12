import {
  LayoutDashboard,
  UserRoundPlus,
  ChartNoAxesColumn,
  Settings
} from "lucide-react";

import styles from "./bottomNav.module.css";
import type { AppView } from "../../../types/layout";

export interface NavProps {
  activeView: AppView
  onNavigate: (AppView: AppView) => void;
}

export default function BottomNav({
  activeView,
  onNavigate
}: NavProps) {
  return (
    <nav
      className={styles.bottomNav}
      aria-label="Mobile navigation"
    >
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
  )
}