import type { NursingConfig } from "../../types/config";
import type { Patient } from "../../types/patient";
import type { TaskInstance } from "../../types/task";
import { generateModuleTasks } from "../scheduling/generateModuleTasks";
import { generateTasks } from "../scheduling/generateTasks";

interface GeneratePatientTasksParams {
  patient: Patient;
  config: NursingConfig;
  shiftStart: Date;
  shiftEnd: Date;
};

export function generatePatientTasks({
  patient,
  config,
  shiftStart,
  shiftEnd
}: GeneratePatientTasksParams): TaskInstance[] {

  const moduleTasks = patient.moduleIds.flatMap(moduleId => {
    const module = config.modules.find(
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

  const patientTasks = patient.tasks.flatMap(task => 
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