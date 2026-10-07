import type { NursingConfig } from "../types/config";
import { bloodTransfusion } from "./modules/bloodTransfusion";
import { core } from "./modules/core";
import { taysCore } from "./modules/taylorsCore";
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
    bloodTransfusion
  ]
};