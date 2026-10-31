import { Fragment } from "react/jsx-runtime";
import styles from "./dashboard.module.css";
import PatientCard from "../patient/patientCard/patientCard";
import { AssignmentStats } from "../layout/assignmentStats/assignmentStats";
import type { Assignment } from "../../types/assignment";

interface Props {
  assignment: Assignment;
}

export default function Dashboard({ 
  assignment,
}: Props) {
  return (
    <div className={styles.dashboard}>
      <AssignmentStats
        patients={assignment.patients} 
      />
      <div className={styles.patientGrid}>
        {assignment.patients.map(patient => (
          <Fragment
            key={patient.id}
          >
            <PatientCard
              patient={patient}
              shiftStart={assignment.shiftStart}
              shiftEnd={assignment.shiftEnd} 
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};