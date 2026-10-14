import type { CareModule } from "../types/careModule"

const modules = import.meta.glob<{
  default: CareModule
}>("./modules/*.ts", {
  eager: true
});

export const systemCareModules: CareModule[]  = 
  Object.values(modules).map(
    file => file.default
  );

export function getCareModuleLibrary(): CareModule[] {
  const saved = localStorage.getItem("customCareModules");

  const customModules: CareModule[] = saved
    ? JSON.parse(saved)
    : [];

  return [
    ...systemCareModules,
    ...customModules
  ];
};