import type { Assignment } from "../../types/assignment";
import type { CareModule } from "../../types/careModule";
import type { Patient } from "../../types/patient";
import type { Shift } from "../../types/shift";
import { generatePatientTasks } from "../patient/generatePatientTasks";
import { getShiftRange } from "../scheduling/getShiftRange";

interface CreateAssignmentParams {
  patients: Patient[];
  shift: Shift;
  date: Date;
  modules: CareModule[]
};

export function createAssignment({
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
  }
}