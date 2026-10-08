import type { TaskDefinition, TaskInstance } from "./task";

export interface Patient {
  id: string;
  room: string;
  
  modules: PatientModule[];

  //Tasks belonging to the patient that persist 
  //Every shift
  taskDefinitions: TaskDefinition[];

  //All Tasks
  taskInstances: TaskInstance[];
};

export interface PatientModule {
  id: string;
  moduleId: string;
  addedAt: Date;
  persistent: boolean;
};