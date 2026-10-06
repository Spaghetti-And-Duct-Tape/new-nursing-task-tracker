import type { TaskDefinition, TaskInstance, TaskSource } from "../../types/task";

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

export function generateTasks(
  params: GenerateTasksParams
): TaskInstance[] {
  switch (params.task.schedule.type) {
    case "frequency":
      return generateFrequencyTasks(params);

    case "timed":
      return generateTimedTasks(params);
  };
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

export function generateTimedTasks({
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
    const hour = parseInt(time.slice(0, 2));
    const minute = parseInt(time.slice(2, 4));

    const scheduledAt = new Date(shiftStart);

    scheduledAt.setHours(
      hour,
      minute,
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
  anchorHour?: number
): Date {
  const baseHour = anchorHour ?? 0

  const anchor = new Date(shiftStart);

  anchor.setHours(
    baseHour,
    0,
    0,
    0
  );

  const frequencyMs = 
    frequency * 3_600_000;

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
    task.schedule.anchorHour
  );

  while (currentTime <= shiftEnd) {
    instances.push(getInstance({
      task,
      patientId,
      source,
      moduleId,
      scheduledAt: new Date(currentTime)
    }));

    currentTime.setHours(
      currentTime.getHours() + task.schedule.hours
    );
  };

  return instances;
};