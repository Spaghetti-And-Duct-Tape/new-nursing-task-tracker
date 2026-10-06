import type { TaskDefinition, TaskInstance } from "./task";

export interface Patient {
  id: string;
  room: string;
  
  moduleIds: string[];

  //Tasks belonging to the patient that persist 
  //Every shift
  taskDefinitions: TaskDefinition[];

  //All Tasks
  taskInstances: TaskInstance[];
};