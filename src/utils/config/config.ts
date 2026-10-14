import { defaultConfig } from "../../data/defaultConfig";
import type { NursingConfig } from "../../types/config";

export function getNurseConfig(): NursingConfig {
  const saved = localStorage.getItem("nursingConfig");

  if (saved) 
    return JSON.parse(saved) as NursingConfig;

  localStorage.setItem(
    "nursingConfig",
    JSON.stringify(defaultConfig)
  );

  return structuredClone(defaultConfig);
};