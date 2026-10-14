import type { Patient } from "../../types/patient";
import { Fragment } from "react/jsx-runtime";
import styles from "./dashboard.module.css";
import PatientCard from "../patient/patientCard/patientCard";

interface DashboardProps {
  patients: Patient[];
  updatePatient: (
    id: string, 
    updater: (patient: Patient) => Patient | null
  ) => void
}

export default function Dashboard({ 
  patients,
  updatePatient
}: DashboardProps) {
  return (
    <div className={styles.dashboard}>
      <div className={styles.patientGrid}>
        {patients.map(patient => (
          <Fragment
            key={patient.id}
          >
            <PatientCard
              patient={patient} 
              updatePatient={updatePatient}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};