import type { Shift } from "./shift";

export interface NursingConfig {
  schemaVersion: number;

  id: string;
  name: string;
  description?: string;

  shifts: Shift[];
  defaultShift: string;

  modules: string[];
}