import type { Patient } from "./patient";
import type { Shift } from "./shift";

export interface Assignment {
  id: string;

  shift: Shift;
  shiftStart: Date;
  shiftEnd: Date;

  patients: Patient[];
};