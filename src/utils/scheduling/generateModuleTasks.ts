import type { CareModule } from "../../types/careModule";
import type { TaskInstance, TaskSource } from "../../types/task";
import { generateTasks } from "./generateTasks";

interface GenerateModuleTasksParams {
  module: CareModule;
  patientId: string;
  patientModuleId: string;
  source: TaskSource;
  shiftStart: Date;
  shiftEnd: Date;
};

export function generateModuleTasks({
  module, 
  patientId,
  patientModuleId,
  shiftStart,
  shiftEnd
}: GenerateModuleTasksParams): TaskInstance[] {
  return module.tasks
    .flatMap(task => 
      generateTasks({
        task,
        patientId,
        moduleId: patientModuleId,
        source: module.source,
        shiftStart,
        shiftEnd,
      })
    );
};