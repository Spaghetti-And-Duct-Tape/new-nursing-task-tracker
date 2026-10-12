import Header from "./components/layout/header/header";
import Sidebar from "./components/layout/sidebar/sidebar";
import { useAssignment } from "./hooks/useAssignment"

import styles from "./App.module.css"
import BottomNav from "./components/layout/bottomNav/bottomNav";
import { useState } from "react";
import type { AppView } from "./types/layout";



export default function App() {
  const {
    assignment
  } = useAssignment();

  const [activeView, setActiveView] = useState<AppView>("dashboard");

  return (
    <div
      className={styles.appLayout}
    >
      <Sidebar
        activeView={activeView} 
        onNavigate={setActiveView}
      />

      <main className={styles.main}>
        <Header
          name={assignment.shift.name}
          start={assignment.shiftStart}
          end={assignment.shiftEnd}
        />
      </main>

      <BottomNav
        activeView={activeView} 
        onNavigate={setActiveView}
      />
    </div>
  )
};