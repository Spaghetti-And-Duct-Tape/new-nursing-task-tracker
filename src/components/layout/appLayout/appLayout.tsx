import { useState } from "react";
import type { Assignment } from "../../../types/assignment";
import Header from "../header/header";
import styles from "./appLayout.module.css"
import type { AppView } from "../../../types/layout";
import AddPatientModal from "../../modals/addPatientModal";
import Sidebar from "../navBar/sidebar";
import BottomNav from "../navBar/bottomNav";
import Dashboard from "../../views/dashboard";
import type { Patient } from "../../../types/patient";

interface AppLayoutProps {
  assignment: Assignment;
  onAddPatient: (patient: {
    room: string,
    moduleIds: string[]
  }) => void;
  updatePatient: (
    id: string, 
    updater: (patient: Patient) => Patient | null
  ) => void
};

export default function AppLayout({
  assignment,
  onAddPatient,
  updatePatient
}: AppLayoutProps) {
  const [activeView, setActiveView] = useState<AppView>("dashboard");
  const [isPatientFormOpen, setIsPatientFormOpen] = useState(false);

  return(
    <div
      className={styles.appLayout}
    >
      <Sidebar
        activeView={activeView} 
        onNavigate={setActiveView}
        onAddPatient={() => setIsPatientFormOpen(true)}
      />

      <main className={styles.main}>
        <Header
          name={assignment.shift.name}
          start={assignment.shiftStart}
          end={assignment.shiftEnd}
        />

        {activeView === "dashboard" && (
          <Dashboard
            patients={assignment.patients} 
            updatePatient={updatePatient}
          />
        )}
      </main>

      <BottomNav
        activeView={activeView} 
        onNavigate={setActiveView}
        onAddPatient={() => setIsPatientFormOpen(true)}
      />
      
      <AddPatientModal
        patientRooms={assignment.patients.map(patient => patient.room)}
        open={isPatientFormOpen}
        onOpenChange={setIsPatientFormOpen}
        onAddPatient={onAddPatient}
      />
    </div>
  )
};