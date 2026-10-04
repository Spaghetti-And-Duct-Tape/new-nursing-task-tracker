import type { Assignment } from "../../types/assignment";
import type { CareModule } from "../../types/careModule";
import type { Patient } from "../../types/patient";
import { generatePatientTasks } from "../patient/generatePatientTasks";

interface AddPatientParams {
  assignment: Assignment;
  patient: Patient;
  modules: CareModule[];
};

export function addPatientToAssignment({
  assignment,
  patient,
  modules
}: AddPatientParams): Assignment {
  
  const newPatient: Patient = {
    ...patient,

    taskInstances: generatePatientTasks({
      patient,
      modules,
      shiftStart: assignment.shiftStart,
      shiftEnd: assignment.shiftEnd
    })
  };

  return {
    ...assignment,

    patients: [
      ...assignment.patients,
      newPatient
    ]
  }
}