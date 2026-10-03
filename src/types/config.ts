import type { CareModule } from "./careModule";
import type { Shift } from "./shift";

export interface NursingConfig {
  schemaVersion: number;

  id: string;
  name: string;
  description?: string;

  shifts: Shift[];
  modules: CareModule[];
}