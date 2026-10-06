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

function App() {
  const {modules} = defaultConfig;

  const [assignment, setAssignment] = useState<Assignment>(() => 
    createAssignment({
      patients: [],
      shift: defaultNightShift,
      date: new Date(),
      modules
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
  
  function addTaskDefinition() {
    setAssignment(prev => {
      if (prev.patients.length === 0)
        return prev;
      
      const patientId = prev.patients[0].id;
      
      const task: TaskDefinition = {
        id: "insulin",
        name: "Insulin",
        category: "medication",
        workflow: "complete-and-chart",
        
        schedule: {
          type: "frequency",
          hours: 4
        }
      };
      
      const instances = generateTasks({
        task,
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
            
            taskDefinitions: [
              ...patient.taskDefinitions,
              task
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
              modules: defaultConfig.modules,
              shiftStart: prev.shiftStart,
              shiftEnd: prev.shiftEnd
            })
          }
        })
      }
    })
  };

  return (
    <main>
      <h2>Nursing Task Tracker</h2>

      <AddPatientForm
        onAddPatient={handleAddPatient}
      />

      <AssignmentView
        assignment={assignment}
        onTaskClick={handleTaskClick} 
        onAddTask={handleAddTask}
        onNoteChange={handleNoteChange}
      />

      {assignment.patients.length !== 0 &&
      <>
        <button
          onClick={addTaskDefinition}
        >
          Add Task Definition
        </button>

        
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