import styles from "./navigation.module.css";
import type { NavProps } from "./navProps";
import NavButtons from "./navButtons";

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
        <NavButtons
          activeView={activeView}
          onNavigate={onNavigate}
          onAddPatient={onAddPatient} 
        />
      </nav>
    </aside>
  )
};