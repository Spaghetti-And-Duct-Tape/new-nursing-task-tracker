import { getCareModuleLibrary } from "../../data/getCareModuleLibrary";
import type { Assignment } from "../../types/assignment";
import type { CareModule } from "../../types/careModule";
import type { NursingConfig } from "../../types/config";
import type { Patient } from "../../types/patient";
import type { Shift } from "../../types/shift";
import { getNurseConfig } from "../config/config";
import { generatePatientTasks } from "../patient/generatePatientTasks";
import { getShiftRange } from "../scheduling/getShiftRange";

interface CreateAssignmentParams {
  patients: Patient[];
  shift: Shift;
  date: Date;
  modules: CareModule[]
};

export function getDefaultConfigs(): Assignment {
  const config: NursingConfig = getNurseConfig();
  const shift = config.shifts.find(shift => 
    shift.id === config.defaultShift
  );

  if (!shift)
    throw new Error("default shift not found.");

  return createAssignment({
    patients: [],
    shift,
    date: new Date(),
    modules: getCareModuleLibrary()
  })
};


function createAssignment({
  patients,
  shift, 
  date,
  modules
}: CreateAssignmentParams): Assignment {
  
  const {
    start: shiftStart,
    end: shiftEnd
  } = getShiftRange(date, shift);
  
  const assignedPatients = patients.map(patient => ({
    ...patient, 

    //Generates all task instances of a patient based 
    //on care modules and task definitions attached to the patient
    taskInstances: generatePatientTasks({
      patient,
      modules,
      shiftStart,
      shiftEnd
    })
  }));

  return {
    id: crypto.randomUUID(),

    shift,
    shiftStart,
    shiftEnd,

    patients: assignedPatients,
  };
};