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
import type { TaskDefinition, TaskInstance } from "./types/task";
import { generateTasks } from "./utils/scheduling/generateTasks";
import { generatePatientTasks } from "./utils/patient/generatePatientTasks";
import type { CareModule } from "./types/careModule";
import { careModuleLibrary } from "./data/careModuleLibrary";
import type { Shift } from "./types/shift";

const date = new Date();

  date.setDate(
    date.getDate() - 1
  );

  date.setHours(
    19,
    0,
    0,
    0
  );

 export const testDate = date;

function App() {
  const {modules} = defaultConfig;
  const library = careModuleLibrary;

  const [assignment, setAssignment] = useState<Assignment>(() => 
    createAssignment({
      patients: [],
      shift: defaultNightShift,
      date: testDate,
      modules: library
    })
  );
  
  function handleTaskClick(
    task: TaskInstance
  ) {
    setAssignment(prev => ({
      ...prev,
      
      patients: prev.patients.map(patient => {
        
        if (patient.id !== task.patientId) 
          return patient;
        
          return {
            ...patient,
            
            taskInstances: patient.taskInstances.map(instance =>
              instance.id === task.id
                ? advanceTaskStatus(instance)
                : instance
            )
          };
      })
    }));
  };

  function handleNoteChange(
    task: TaskInstance,
    note: string
  ) {
    setAssignment(prev => ({
      ...prev,

      patients: prev.patients.map(patient => {
        if (patient.id !== task.patientId)
          return patient;

        return {
          ...patient,

          taskInstances: patient.taskInstances.map(instance => 
            instance.id === task.id
              ? {
                ...instance,
                note
              } : instance
          )
        }
      })
    }))
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

  function handleAddTask(task: TaskInstance) {
    setAssignment(prev => ({
      ...prev,

      patients: prev.patients.map(patient => {
        if (patient.id !== task.patientId)
          return patient;

        return {
          ...patient,

          taskInstances: [
            ...patient.taskInstances,
            task
          ].sort(
            (a, b) => 
              a.scheduledAt.getTime() -
              b.scheduledAt.getTime()
          )
        };
      })
    }));
  };
  
  function handleAddDefinition(
    patientId: string,
    definition: TaskDefinition,
    persistent: boolean
  ) {
    setAssignment(prev => {
      if (prev.patients.length === 0)
        return prev;
      
      const instances = generateTasks({
        task: definition,
        patientId,
        source: "manual",
        shiftStart: prev.shiftStart,
        shiftEnd: prev.shiftEnd
      });
      
      return {
        ...prev,
        
        patients: prev.patients.map(patient => {
          if (patient.id !== patientId)
            return patient;
          
          return {
            ...patient,
            
            taskDefinitions: persistent
              ? [
                ...patient.taskDefinitions,
                definition
              ] 
              : patient.taskDefinitions,
            
            taskInstances: [
              ...patient.taskInstances,
              ...instances
            ].sort(
              (a, b) =>
                a.scheduledAt.getTime() -
                b.scheduledAt.getTime()
            )
          };
        })
      };
    });
  };

  function resetPatient() {
    setAssignment(prev => {
      if (prev.patients.length === 0)
        return prev;
      
      const patientId = prev.patients[0].id;

      return {
        ...prev,

        patients: prev.patients.map(patient => {
          if (patient.id !== patientId)
            return patient;

          return {
            ...patient,

            taskInstances: []
          }
        })
      }
    });
  };

  function returnPatient() {
    setAssignment(prev => {
      if (prev.patients.length === 0) 
        return prev;

      const patientId = prev.patients[0].id;

      return {
        ...prev,

        patients: prev.patients.map(patient => {
          if (patient.id !== patientId)
            return patient;

          return {
            ... patient,
            
            taskInstances: generatePatientTasks({
              patient,
              modules: library,
              shiftStart: prev.shiftStart,
              shiftEnd: prev.shiftEnd
            })
          }
        })
      }
    })
  };

  function handleAddCareModule(
    patientId: string,
    module: CareModule
  ) {
    setAssignment(prev => {
      const patient = prev.patients.find(
        patient => patient.id === patientId
      );

      const patientModuleId = crypto.randomUUID();

      if (!patient) return prev;

      if (
        module.persistent
        && patient.modules.some(m => m.moduleId === module.id)
      ) return prev;

      const instances = module.tasks.flatMap(task => 
        generateTasks({
          task,
          patientId,
          moduleId: patientModuleId,
          source: "system",
          shiftStart: prev.shiftStart,
          shiftEnd: prev.shiftEnd,
        })
      );

      return {
        ...prev,

        patients: prev.patients.map(patient => {
          if (patient.id !== patientId)
            return patient;

          return {
            ...patient,

            modules: [
                ...patient.modules,
                {
                  id: patientModuleId,
                  moduleId: module.id,
                  addedAt: new Date(),
                  persistent: module.persistent
                }
            ],

            taskInstances: [
              ...patient.taskInstances,
              ...instances
            ].sort(
              (a, b) => 
                a.scheduledAt.getTime() - 
              b.scheduledAt.getTime()
            )
          };
        })
      };
    });
  };

  function handleRemoveCareModule(
    patientId: string,
    patientModuleId: string
  ) {
    setAssignment(prev => ({
      ...prev,
      patients: prev.patients.map(patient => {
        if (patient.id !== patientId) return patient;

        return {
          ...patient,

          modules: patient.modules.filter(
            module => module.id !== patientModuleId
          ),

          taskInstances: patient.taskInstances.filter(
            task => {
              console.log(task.moduleId, patientModuleId)
              return task.moduleId !== patientModuleId
            }
          )
        };
      })
    }));
  };

  function testNextShift() {
    setAssignment(prev => {
      const nextShift: Shift = 
        prev.shift.name === "Day" ? defaultNightShift : defaultDayShift;

        const nextDate = new Date(prev.shiftEnd);

        return createAssignment({
          patients: prev.patients,
          shift: nextShift,
          date: nextDate,
          modules: careModuleLibrary
        });
    });
  };

  return (
    <main>
      <h2>Nursing Task Tracker</h2>

      <button
        onClick={testNextShift}
      >
        Test Next Shift
      </button>

      <AddPatientForm
        onAddPatient={handleAddPatient}
      />

      <AssignmentView
        assignment={assignment}
        onTaskClick={handleTaskClick} 
        onAddTask={handleAddTask}
        onAddDefinition={handleAddDefinition}
        onNoteChange={handleNoteChange}
        onAddModule={handleAddCareModule}
        onRemoveModule={handleRemoveCareModule}
      />

      {assignment.patients.length !== 0 &&
      <>
        <button
          onClick={resetPatient}
        >
          Reset Patient
        </button>

        
        <button
          onClick={returnPatient}
        >
          Return Patient
        </button>
        </>
      }
    </main>
  );
};

export default App;