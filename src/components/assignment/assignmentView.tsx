import type { Assignment } from "../../types/assignment";
import type { TaskInstance } from "../../types/task";
import { PatientView } from "../patient/patientView";

interface AssignmentViewProps {
  assignment: Assignment;
  onTaskClick: (task: TaskInstance) => void;
  onAddTask: (task: TaskInstance) => void;
  onNoteChange: (
    task: TaskInstance,
    note: string 
  ) => void;
};

export function AssignmentView({
  assignment,
  onTaskClick,
  onAddTask,
  onNoteChange
}: AssignmentViewProps) {
  return (
    <main>
      {assignment.patients.map(patient => (
        <PatientView
          key={patient.id}
          patient={patient}
          onTaskClick={onTaskClick}
          onAddTask={onAddTask}
          onNoteChange={onNoteChange}
        />
      ))}
    </main>
  )
}