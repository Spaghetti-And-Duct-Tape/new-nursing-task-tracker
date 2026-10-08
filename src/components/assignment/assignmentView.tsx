import type { Assignment } from "../../types/assignment";
import type { CareModule } from "../../types/careModule";
import type { TaskDefinition, TaskInstance } from "../../types/task";
import { PatientView } from "../patient/patientView";

interface AssignmentViewProps {
  assignment: Assignment;
  onTaskClick: (task: TaskInstance) => void;
  onAddTask: (task: TaskInstance) => void;
  onAddDefinition: (
    patientId: string,
    definition: TaskDefinition,
    persistent: boolean
  ) => void;
  onNoteChange: (
    task: TaskInstance,
    note: string 
  ) => void;
  onAddModule: (
    patientId: string,
    module: CareModule
  ) => void;
};

export function AssignmentView({
  assignment,
  onTaskClick,
  onAddTask,
  onAddDefinition,
  onNoteChange,
  onAddModule
}: AssignmentViewProps) {
  return (
    <main>
      {assignment.patients.map(patient => (
        <PatientView
          key={patient.id}
          patient={patient}
          onTaskClick={onTaskClick}
          onAddTask={onAddTask}
          onAddDefinition={onAddDefinition}
          onNoteChange={onNoteChange}
          onAddModule={onAddModule}
        />
      ))}
    </main>
  )
}