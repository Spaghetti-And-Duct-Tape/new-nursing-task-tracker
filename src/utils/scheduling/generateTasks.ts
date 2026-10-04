import type { TaskDefinition, TaskInstance, TaskSource } from "../../types/task";

interface GenerateTasksParams {
  task: TaskDefinition;
  patientId: string;
  source: TaskSource;
  shiftStart: Date;
  shiftEnd: Date;
};

type GetInstanceParams =
  Omit<GenerateTasksParams, "shiftStart" | "shiftEnd"> & 
  {
    scheduledAt: Date;
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
  scheduledAt
}: GetInstanceParams): TaskInstance {
  return {
    id: crypto.randomUUID(),

    definitionId: task.id,
    patientId,

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
  shiftEnd
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

    if (scheduledAt < shiftStart) scheduledAt.setDate(
      scheduledAt.getDate() + 1
    );

    if (scheduledAt > shiftEnd) return

    instances.push(getInstance({
      task,
      patientId,
      source,
      scheduledAt
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
    frequency * 60 * 60 * 1000;

  while (anchor < shiftStart) {
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
  shiftEnd
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
      scheduledAt: new Date(currentTime)
    }));

    currentTime.setHours(
      currentTime.getHours() + task.schedule.hours
    );
  };

  return instances;
};