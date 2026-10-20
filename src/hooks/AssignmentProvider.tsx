import { createContext, useContext, useState } from "react";
import type { Assignment } from "../types/assignment";
import { createPatient } from "../utils/patient/createPatient";
import { addPatientToAssignment } from "../utils/assignment/addPatientToAssignment";
import { getCareModuleLibrary } from "../data/getCareModuleLibrary";
import { getDefaultConfigs } from "../utils/assignment/createAssignment";
import { parseAssignment } from "../utils/assignment/parseAssignmnet";
import type { Patient } from "../types/patient";
import type { TaskDefinition, TaskInstance } from "../types/task";
import { sortByTime } from "../utils/utils";
import { generateTasks } from "../utils/scheduling/generateTasks";

type AssignmentContextValue = {
  assignment: Assignment;
  addPatient: (data: {
    room: string;
    moduleIds: string[]
  }) => void;
  updatePatient: (
    updatedPatient: Patient
  ) => void;
  removePatient: (
    id: string
  ) => void;
  addTaskDefinition: (
    patientId: string,
    taskDefinitions: TaskDefinition
  ) => void;
  addTaskInstance: (
    newTask: TaskInstance
  ) => void;
  updateTask: (
    updatedTask: TaskInstance
  ) => void;
}

const AssignmentContext = createContext<AssignmentContextValue | null>(null);
const localStorateKey= "nuring-assignment";

export function AssignmentProvider({children} : {children: React.ReactNode}) {
  const [assignment, setAssignment] = useState(() => {
    const saved = localStorage.getItem(localStorateKey);
    
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

    setAndSaveAssignment(newAssignment);
  };

  function updatePatient(updatedPatient: Patient) {
    const newAssignment = {
      ...assignment,
      patients: assignment.patients.map(patient => 
        patient.id === updatedPatient.id ?
          updatedPatient :
          patient
      )
    };

    setAndSaveAssignment(newAssignment);
  };

  function removePatient(id: string) {
    const newAssignment = {
      ...assignment,
      patients: assignment.patients.filter(patient => 
        patient.id !== id
      )
    };

    setAndSaveAssignment(newAssignment);
  };  

  function addTaskDefinition(
    patientId: string,
    taskDefintion: TaskDefinition
  ) {
    const patient = assignment.patients.find(
      patient => patient.id === patientId
    );

    if (!patient) return;

    const taskInstances = generateTasks({
      task: taskDefintion,
      patientId,
      source: "manual",
      shiftStart: assignment.shiftStart,
      shiftEnd: assignment.shiftEnd,
    });

    updatePatient({
      ...patient,
      taskDefinitions: [...patient.taskDefinitions, taskDefintion],
      taskInstances: sortByTime([
        ...patient.taskInstances,
        ...taskInstances
      ])
    });
  };
  
  function addTaskInstance(newTask: TaskInstance) {
    const patient = assignment.patients.find(
      patient => patient.id === newTask.patientId
    );

    if (!patient) return;

    updatePatient({
      ...patient,
      taskInstances: sortByTime([
        ...patient.taskInstances,
        newTask
      ])
    });
  };

  function updateTask(updatedTask: TaskInstance) {
    const patient = assignment.patients.find(
      patient => patient.id === updatedTask.patientId
    );

    if (!patient) return;

    updatePatient({
      ...patient,
      taskInstances: patient.taskInstances.map(task => 
        task.id === updatedTask.id
          ? updatedTask
          : task
      )
    })
  };

  function setAndSaveAssignment(assignment: Assignment) {
    localStorage.setItem(
      localStorateKey,
      JSON.stringify(assignment)
    );

    setAssignment(assignment);
  };

  return (
    <AssignmentContext.Provider
      value={{
        assignment,
        addPatient,
        updatePatient,
        removePatient,
        addTaskDefinition,
        addTaskInstance,
        updateTask
      }}
    >
      {children}
    </AssignmentContext.Provider>
  )
};

export function useAssignment() {
  const context = useContext(AssignmentContext);

  if (context === null)
    throw new Error("useAssignment must be used within an AssignmentProvider");

  return context;
};

/*export function useAssignment1() {
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
    
    setAndSaveAssignment(newAssignment);
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
      localStorateKey,
      JSON.stringify(assignment)
    );
    setAssignment(assignment);
  };

  return {
    assignment,
    addPatient,
    updatePatient
  }
};*/