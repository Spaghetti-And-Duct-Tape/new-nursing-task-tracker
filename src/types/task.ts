import type { TimeString } from "./time";

export type TaskCategory = 
  | "chart"
  | "medication"
  | "personal";

export type TaskSource = 
  | "system"
  | "personal"
  | "manual";

export type TaskWorkflow = 
  | "complete"
  | "complete-and-chart"
  | "chart";


export interface TaskSchedule {
  times: (TimeString | "now" | "hour")[];
  offset: number;
  interval: number;
  repeat: number;
}

export interface TaskDefinition {
  id: string;
  name: string;
  category: TaskCategory;

  workflow: TaskWorkflow;

  schedule: TaskSchedule;
};

export interface TaskInstance {
  id: string;

  patientId: string;
  moduleId?: string;
  definitionId: string;


  name: string;
  category: TaskCategory;
  source: TaskSource;

  workflow: TaskWorkflow;

  scheduledAt: Date;

  completed: boolean;
  completedAt?: Date;

  charted: boolean;
  chartedAt?: Date;

  note?: string;
}