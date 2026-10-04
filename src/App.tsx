import { useState } from "react";
import { defaultConfig } from "./data/defaultConfig";
import { defaultDayShift, defaultNightShift } from "./data/shift";
import type { Patient } from "./types/patient";
import { createAssignment } from "./utils/assignment/createAssignment";
import type { Assignment } from "./types/assignment";
import { advanceTaskStatus } from "./utils/tasks/advanceTaskStatus";
import { AssignmentView } from "./components/assignment/assignmentView";
import { addPatientToAssignment } from "./utils/assignment/addPatientToAssignment";
import { AddPatientForm } from "./components/patient/addPatientForm";


  const patient414: Patient = {
    id: crypto.randomUUID(),
    room: "414",
    moduleIds: [
      "icu-core",
      "sedation",
      "restraints"
    ],
    taskDefinition: [{
      id: "insulin",
      name: "Insulin",
      category: "medication",
      workflow: "complete-and-chart",

      schedule: {
        type: "frequency",
        hours: 4,
        anchorHour: 0
      }
    }],
    taskInstances: []
  };

  const patient415: Patient = {
    id: "patient-415",
    room: "415",

    moduleIds: [
      "icu-core"
    ],

    taskDefinition: [{
      id: "metoprolol",
      name: "Metoprolol",
      category: "medication",
      workflow: "complete-and-chart",

      schedule: {
        type: "frequency",
        hours: 6,
        anchorHour: 0
      }
    }],

    taskInstances: []
  };

function App() {
  const {modules} = defaultConfig;
  const [assignment, setAssignment] = useState<Assignment>(() => 
    createAssignment({
      patients: [],
      shift: defaultDayShift,
      date: new Date(),
      modules
    })
  );
  
  function handleTaskClick(
    patientId: string,
    taskId: string
  ) {
    setAssignment((previous) => ({
      ...previous,
      
      patients: previous.patients.map((patient) => {
        
        if (patient.id !== patientId) 
          return patient;
        
          return {
            ...patient,
            
            taskInstances: patient.taskInstances.map(task =>
              task.id === taskId
                ? advanceTaskStatus(task)
                : task
            )
          };
      })
    }));
  };

  function handleAddPatient(patient: Patient) {
    setAssignment(prev => 
      addPatientToAssignment({
        assignment: prev,
        patient,
        modules
      })
    )
  };

  return (
    <main>
      <h2>Nursing Task Tracker</h2>

      <AddPatientForm
        modules={modules}
        onAddPatient={handleAddPatient}
      />

      <AssignmentView
        assignment={assignment}
        onTaskClick={handleTaskClick} 
      />
    </main>
  );
};

export default App;