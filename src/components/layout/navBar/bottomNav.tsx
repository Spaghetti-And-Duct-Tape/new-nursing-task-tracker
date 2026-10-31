import styles from "./navigation.module.css";
import type { NavProps } from "./navProps";
import NavButtons from "./navButtons";

export default function BottomNav({
  activeView,
  onNavigate, 
  onAddPatient
}: NavProps) {
  return (
    <nav
      className={styles.bottomNav}
      aria-label="Mobile navigation"
    >
      <NavButtons
        activeView={activeView}
        onNavigate={onNavigate}
        onAddPatient={onAddPatient}
      />
    </nav>
  );
};