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

export type TaskSchedule = 
  | {
    type: "frequency";
    hours: number;
    anchorHour?: number;
  } | {
    type: "timed";
    times: string[];
  };

export interface TaskDefinition {
  id: string;
  name: string;
  category: TaskCategory;

  workflow: TaskWorkflow;

  schedule: TaskSchedule;
};

export interface TaskInstance {
  id: string;

  definitionId: string;
  patientId: string;

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