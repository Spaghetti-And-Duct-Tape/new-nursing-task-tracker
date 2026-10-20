import type { TimeString } from "./time";

export type SchedulePreset = {
  id: string;
  label: string;
  times: TimeString[];
  interval: number;
  intervalUnit: "minutes" | "hours" 
  repeat: number;
};