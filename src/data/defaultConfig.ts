import type { NursingConfig } from "../types/config";
import { icuCore } from "./modules/icuCore";
import { restraints } from "./modules/restraints";
import { sedation } from "./modules/sedation";
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

  modules: [
    icuCore,
    sedation,
    restraints
  ]
};