import { getCareModuleLibrary } from "../../data/getCareModuleLibrary";

export function createPatient({
  room,
  moduleIds
}: {
  room: string;
  moduleIds: string[]
}) {
  const modules = getCareModuleLibrary().filter(module => 
    moduleIds.includes(module.id)
  );

  return {
    id: crypto.randomUUID(),
    room,
    modules: modules.map(
      module => ({
        id: crypto.randomUUID(),
        moduleId: module.id,
        addedAt: new Date(),
        persistent: module.persistent
      })
    ),

    taskDefinitions: [],
    taskInstances: []
  };
};