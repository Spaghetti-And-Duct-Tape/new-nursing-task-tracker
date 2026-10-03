import type { Shift } from "../types/shift";

export const defaultDayShift: Shift = {
  id: "day",
  name: "Day",
  start: { hour: 7, minute: 0 },
  end: { hour: 19, minute: 30 }
};

export const defaultNightShift: Shift = {
  id: "night",
  name: "Night",
  start: { hour: 19, minute: 0 },
  end: { hour: 7, minute: 30 }
}