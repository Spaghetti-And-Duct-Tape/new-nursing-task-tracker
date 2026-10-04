import type { Assignment } from "../../types/assignment";
import { PatientView } from "../patient/patientView";

interface AssignmentViewProps {
  assignment: Assignment;

  onTaskClick: (
    patientId: string,
    taskId: string
  ) => void;
};

export function AssignmentView({
  assignment,
  onTaskClick
}: AssignmentViewProps) {
  return (
    <main>
      {assignment.patients.map(patient => (
        <PatientView
          key={patient.id}
          patient={patient}

          onTaskClick={(taskId) => 
            onTaskClick(
              patient.id,
              taskId
            )
          }
        />
      ))}
    </main>
  )
}