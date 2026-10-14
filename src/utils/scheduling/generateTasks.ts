import type { TaskDefinition, TaskInstance, TaskSource } from "../../types/task";
import { addOffsetMin, getScheduledAt } from "../utils";

interface GenerateTasksParams {
  task: TaskDefinition;
  patientId: string;
  source: TaskSource;
  shiftStart: Date;
  shiftEnd: Date;
  moduleId?: string;
};

type GetInstanceParams =
  Omit<GenerateTasksParams, "shiftStart" | "shiftEnd"> & 
  {
    scheduledAt: Date;
  };

//The time used for generation tasks
//if it differs from shiftStart. I.E.
//starting mid shift or inputting a task 
//in the middle of the shift
function generationStart(
  shiftStart: Date,
  currentTime: Date = new Date()
) {
  const graceStart = new Date(currentTime);

  graceStart.setHours(
    graceStart.getHours() - 1,
    0,
    0,
    0
  );

  return new Date(
    Math.max(
      shiftStart.getTime(),
      graceStart.getTime()
    )
  )
};

function getInstance({
  task,
  patientId,
  source,
  scheduledAt,
  moduleId
}: GetInstanceParams): TaskInstance {
  return {
    id: crypto.randomUUID(),

    patientId,
    ...(moduleId && {moduleId}),
    definitionId: task.id,

    name: task.name,
    category: task.category,
    source,
    workflow: task.workflow,

    scheduledAt,

    completed: false,
    charted: false
  };
};

export function generateTasks(
  params: GenerateTasksParams
): TaskInstance[] {
  const {
    task, 
    patientId, 
    source, 
    shiftStart, 
    shiftEnd, 
    moduleId
  } = params;
  const { schedule } = task;

  const instances: TaskInstance[] = [];
  const start = generationStart(shiftStart);

  schedule.times.forEach(time => {
    const scheduledAt = addOffsetMin(
      getScheduledAt(time, shiftStart), 
      schedule.offset
    );

    for (let i = 0; i < schedule.repeat; i++) {
      const repeatedAt = addOffsetMin(
        scheduledAt,
        i * schedule.interval
      );

      if (repeatedAt < start) continue;
      if (repeatedAt > shiftEnd) break;
      
      instances.push(getInstance({
        task,
        patientId,
        source,
        scheduledAt: repeatedAt,
        moduleId
      }));
    };
  });

  return instances;
};