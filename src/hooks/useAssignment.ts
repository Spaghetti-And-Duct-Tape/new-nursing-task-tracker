import { useState } from "react";
import type { Assignment } from "../types/assignment";
import { getNurseConfig } from "../utils/config/config";
import type { NursingConfig } from "../types/config";
import { createAssignment } from "../utils/assignment/createAssignment";
import { getCareModuleLibrary } from "../data/getCareModuleLibrary";

export function useAssignment() {
  const [assignment, setAssignment] = useState<Assignment>(() => {
    const config: NursingConfig = getNurseConfig();
    const shift = config.shifts.find(shift => 
      shift.id === config.defaultShift
    );

    if (!shift) 
      throw new Error("Default shift not found.");

    return createAssignment({
      patients: [],
      shift,
      date: new Date(),
      modules: getCareModuleLibrary()
    });
  });

  return {
    assignment
  }
};