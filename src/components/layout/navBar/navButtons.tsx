import {
  LayoutDashboard,
  UserRoundPlus,
  ChartNoAxesColumn,
  Settings,
  type LucideIcon
} from "lucide-react";

import styles from "./navigation.module.css";
import type { AppView } from "../../../types/layout";

export default function NavButtons({
  activeView,
  onNavigate,
  onAddPatient
} : {
  activeView: AppView,
  onNavigate: (view: AppView) => void;
  onAddPatient: () => void;
}) {
  return (
    <>
      <NavButtonLayout
        label="dashboard"
        icon={LayoutDashboard}
        activeView={activeView}
        onNavigate={onNavigate}
      />
      
      <button
        className={styles.navItem}
        onClick={onAddPatient}
      >
        <UserRoundPlus />
        <span>Add Patient</span>
      </button>

      <NavButtonLayout
        label="timeline"
        icon={ChartNoAxesColumn}
        activeView={activeView}
        onNavigate={onNavigate}
      />

      <NavButtonLayout
        label="settings"
        icon={Settings}
        activeView={activeView}
        onNavigate={onNavigate}
      />
    </>
  )
};

interface Props {
  label: AppView;
  icon: LucideIcon;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
};

function NavButtonLayout({
  label,
  icon: Icon,
  activeView,
  onNavigate
}: Props) {
  const formattedLabel = label.charAt(0).toUpperCase() + 
    label.slice(1);

  return (
    <button
      className={`${styles.navItem} ${
        activeView === label ? styles.active : ""
      }`}
      onClick={() => onNavigate(label)}
      disabled={activeView === label}
    >
      <Icon />
      <span>{formattedLabel}</span>
    </button>
  )
};