import { useState } from "react";
import Header from "../header/header";
import styles from "./appLayout.module.css"
import type { AppView } from "../../../types/layout";
import AddPatientModal from "../../modals/addPatientModal";
import Sidebar from "../navBar/sidebar";
import BottomNav from "../navBar/bottomNav";
import Dashboard from "../../views/dashboard";
import { useAssignment } from "../../../hooks/AssignmentProvider";

export default function AppLayout() {
  const {assignment, addPatient} = useAssignment();

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
        onAddPatient={addPatient}
      />
    </div>
  )
};