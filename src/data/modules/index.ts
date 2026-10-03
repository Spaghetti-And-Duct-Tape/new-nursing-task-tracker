import { icuCore } from "./icuCore";
import { restraints } from "./restraints";
import { sedation } from "./sedation";

export const careModules = {
  "icu-core": icuCore,
  sedation,
  restraints
} as const;

export type CareModuleId = keyof typeof careModules;