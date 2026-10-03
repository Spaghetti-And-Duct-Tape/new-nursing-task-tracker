import type { TaskDefinition } from "./task";

export interface Patient {
  id: string;
  room: string;
  
  moduleIds: string[];
  tasks: TaskDefinition[];
};