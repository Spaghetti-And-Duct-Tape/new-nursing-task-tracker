import type { CareModule } from "../../types/careModule";
import type { Patient } from "../../types/patient";
import type { TaskInstance } from "../../types/task";
import { generateModuleTasks } from "../scheduling/generateModuleTasks";
import { generateTasks } from "../scheduling/generateTasks";

interface GeneratePatientTasksParams {
  patient: Patient;
  modules: CareModule[];
  shiftStart: Date;
  shiftEnd: Date;
};

export function generatePatientTasks({
  patient,
  modules,
  shiftStart,
  shiftEnd
}: GeneratePatientTasksParams): TaskInstance[] {

  const moduleTasks = patient.moduleIds.flatMap(moduleId => {
    const module = modules.find(
      module => module.id === moduleId
    );

    if (!module) return [];

    return generateModuleTasks({
      module,
      patientId: patient.id,
      source: "system",
      shiftStart,
      shiftEnd
    });
  });

  const patientTasks = patient.taskDefinition.flatMap(task => 
    generateTasks({
      task,
      patientId: patient.id,
      source: "personal",
      shiftStart,
      shiftEnd
    })
  );

  return [
    ...moduleTasks,
    ...patientTasks
  ].sort(
    (a, b) => 
      a.scheduledAt.getTime() - 
      b.scheduledAt.getTime()
  );
};