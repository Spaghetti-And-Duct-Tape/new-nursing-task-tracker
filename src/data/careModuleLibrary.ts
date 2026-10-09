import type { CareModule } from "../types/careModule"

const modules = import.meta.glob<{
  default: CareModule
}>("./modules/*.ts", {
  eager: true
});

export const careModuleLibrary: CareModule[]  = 
  Object.values(modules).map(
    file => file.default
  );