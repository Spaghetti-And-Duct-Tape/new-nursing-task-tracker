import type { Patient } from "../../types/patient";
import { TaskItem } from "../task/taskItem";

interface PatientViewProps {
  patient: Patient;
  onTaskClick: (taskId: string) => void;
}

export function PatientView({
  patient,
  onTaskClick
}: PatientViewProps) {
  return (
    <section>
      <h2>Room {patient.room}</h2>

      {patient.taskInstances.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onClick={() => onTaskClick(task.id)} 
        />
      ))}
    </section>
  )
};