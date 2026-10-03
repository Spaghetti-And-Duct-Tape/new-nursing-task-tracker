import type { TaskDefinition } from "./task";

export interface CareModule {
  id: string;
  name: string;
  description?: string;

  tasks: TaskDefinition[];
}