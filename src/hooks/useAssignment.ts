import { useState } from "react";
import type { Assignment } from "../types/assignment";
import { createPatient } from "../utils/patient/createPatient";
import { addPatientToAssignment } from "../utils/assignment/addPatientToAssignment";
import { getCareModuleLibrary } from "../data/getCareModuleLibrary";
import { getDefaultConfigs } from "../utils/assignment/createAssignment";
import { parseAssignment } from "../utils/assignment/parseAssignmnet";
import type { Patient } from "../types/patient";

export function useAssignment() {
  const [assignment, setAssignment] = useState<Assignment>(() => {
    const saved = localStorage.getItem("nursing-assignment");

    return saved ? 
      parseAssignment(saved) :
      getDefaultConfigs();
  });

  function addPatient({
    room,
    moduleIds
  }: {
    room: string;
    moduleIds: string[];
  }) {
    const patient = createPatient({room, moduleIds});

    const newAssignment = addPatientToAssignment({
      assignment,
      patient,
      modules: getCareModuleLibrary()
    });

    localStorage.setItem(
      "nursing-assignment",
      JSON.stringify(newAssignment)
    );

    setAssignment(newAssignment);
  };

  function updatePatient(
    id: string,
    updater: (patient: Patient) => Patient | null
  ) {

    const newAssignment = {
      ...assignment,
      patients: assignment.patients.flatMap(patient => {
        if (patient.id !== id) return [patient];

        const updated = updater(patient);

        return updated ? [updated] : [];
      })
    };

    setAndSaveAssignment(newAssignment);
  };

  function setAndSaveAssignment(assignment: Assignment) {
    localStorage.setItem(
      "nursing-assignment",
      JSON.stringify(assignment)
    );
    setAssignment(assignment);
  };

  return {
    assignment,
    addPatient,
    updatePatient
  }
};