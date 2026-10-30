import type { SchedulePreset } from "../types/taskSchedulePresets";

export const schedulePresets: SchedulePreset[] = [{
  id: "q1h",
  label: "Q1 Hour",
  times: ["07:00", "19:00"],
  interval: 1,
  intervalUnit: "hours",
  repeat: 13
}, {
  id: "q2h",
  label: "Q2 Hour",
  times: ["08:00", "20:00"],
  interval: 2,
  intervalUnit: "hours",
  repeat: 6
}, {
  id: "q4h",
  label: "Q4 Hour",
  times: ["08:00", "20:00"],
  interval: 4,
  intervalUnit: "hours",
  repeat: 3
}, {
  id: "q6h",
  label: "Q6 Hours",
  times: ["12:00", "00:00"],
  interval: 6,
  intervalUnit: "hours",
  repeat: 2
}, {
  id: "q8h",
  label: "Q8 Hours",
  times: ["08:00", "20:00"],
  interval: 8,
  intervalUnit: "hours",
  repeat: 2
}, {
  id: "achs",
  label: "ACHS",
  times: ["08:30", "12:30", "17:30", "21:00"],
  interval: 0,
  intervalUnit: "hours",
  repeat: 1
}];