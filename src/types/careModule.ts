import type { TaskDefinition, TaskSource } from "./task";

export interface CareModule {
  id: string;
  name: string;
  description?: string;

  source: Exclude<TaskSource, "manual">;

  persistent: boolean;

  tasks: TaskDefinition[];
};