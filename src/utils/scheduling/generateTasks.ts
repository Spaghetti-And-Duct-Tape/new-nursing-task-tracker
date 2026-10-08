import { testDate } from "../../App";
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
    graceStart.getHours() - 24,
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

  return instances
};

/*export function generateTimedTasks({
  task,
  patientId,
  source,
  shiftStart,
  shiftEnd,
  moduleId
}: GenerateTasksParams): TaskInstance[] {

  if (task.schedule.type !== "timed") return [];

  const instances: TaskInstance[] = [];

  task.schedule.times.forEach(time => {
    const [hours, minutes] = time.split(":").map(Number);

    const scheduledAt = new Date(shiftStart);

    scheduledAt.setHours(
      hours,
      minutes,
      0,
      0
    );

    if (scheduledAt < generationStart(shiftStart)) scheduledAt.setDate(
      scheduledAt.getDate() + 1
    );

    if (scheduledAt > shiftEnd) return

    instances.push(getInstance({
      task,
      patientId,
      source,
      scheduledAt,
      moduleId
    }));
  });

  return instances;
};

function getFrequencyStart(
  shiftStart: Date,
  frequency: number,
  anchorHour?: string
): Date {
  const [hours, minutes] = 
    (anchorHour ?? "00:00")
      .split(":")
      .map(Number);

  const anchor = new Date(shiftStart);

  anchor.setHours(
    hours, 
    minutes,
    0,
    0,
  );

  const frequencyMs = 
    frequencyInMilliseconds(frequency)

  while (anchor < generationStart(shiftStart)) {
    anchor.setTime(
      anchor.getTime() + frequencyMs
    );
  };

  return anchor;
};

export function generateFrequencyTasks({
  task,
  patientId,
  source,
  shiftStart,
  shiftEnd,
  moduleId
}: GenerateTasksParams): TaskInstance[] {

  //Only works on tasks with frequency
  if (task.schedule.type !== "frequency") return [];

  const instances: TaskInstance[] = [];

  const currentTime = getFrequencyStart(
    shiftStart,
    task.schedule.hours,
    task.schedule.anchorTime
  );

  while (currentTime <= shiftEnd) {    
    instances.push(getInstance({
      task,
      patientId,
      source,
      moduleId,
      scheduledAt: new Date(currentTime)
    }));

    currentTime.setTime(
      currentTime.getTime() + 
      frequencyInMilliseconds(task.schedule.hours)
    );
  };

  return instances;
};*/