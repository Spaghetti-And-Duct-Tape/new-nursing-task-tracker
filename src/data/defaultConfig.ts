import type { NursingConfig } from "../types/config";
import core from "./modules/core";
import { defaultDayShift, defaultNightShift } from "./shift";

export const defaultConfig: NursingConfig = {
  schemaVersion: 1,
  id: "default",
  name: "Default Nursing Workflow",
  description: "Default configuration for the Nursing Task Tracker.",

  shifts: [
    defaultDayShift,
    defaultNightShift
  ],

  defaultShift: defaultNightShift.id,

  modules: [
    core.id
  ]
};