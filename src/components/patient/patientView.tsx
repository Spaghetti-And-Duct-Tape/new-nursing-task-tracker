import React, { useState } from "react";
import type { Patient } from "../../types/patient";
import type { TaskDefinition, TaskInstance } from "../../types/task";
import { TaskItem } from "../task/taskItem";
import { TaskNoteEditor } from "../task/taskNoteEditor";
import { AddInstanceForm } from "../task/addInstanceForm";
import { getHour } from "../../utils/utils";
import { AddDefinitionForm } from "../task/addDefinitionForm";
import { AddModuleForm } from "../task/addModuleForm";
import type { CareModule } from "../../types/careModule";
import PatientModules from "./patientModules";
import { careModuleLibrary } from "../../data/careModuleLibrary";

interface PatientViewProps {
  patient: Patient;
  onTaskClick: (task: TaskInstance) => void;
  onAddTask: (task: TaskInstance) => void;
  onAddDefinition: (
    patientId: string,
    definition: TaskDefinition,
    persistent: boolean
  ) => void;
  onNoteChange: (
    task: TaskInstance,
    note: string 
  ) => void;
  onAddModule: (
    patientId: string,
    module: CareModule
  ) => void;
  onRemoveModule: (
    patientId: string,
    patientModuleId: string
  ) => void;
}

export function PatientView({
  patient,
  onTaskClick,
  onAddTask,
  onAddDefinition,
  onNoteChange,
  onAddModule,
  onRemoveModule
}: PatientViewProps) {
  const [activeTaskId, setActiveTaskId] = useState<
    string | null
  > (null);

  const [activeForm, setActiveForm] = useState<
  "module" | "definition" | "instance" | null
  >(null);

  const [showModules, setShowModules] = useState(false);


  function handleTaskClick(task: TaskInstance) {
    onTaskClick(task);
    setActiveTaskId(task.id);
  };

  const hours = [
    ...new Set(
      patient.taskInstances.map(task => 
        getHour(task.scheduledAt).getTime()
  ))].map(time => new Date(time));

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "5px"
      }}
    >
      <h2>Room {patient.room}</h2>

      <button
        type="button"
        onClick={() => 
          setShowModules(prev => !prev)
        }
      >
        {">"}
      </button>
      {showModules && (
        <PatientModules
          patient={patient}
          careModules={careModuleLibrary}
          onRemoveModule={onRemoveModule}
        />
      )}

      {activeForm === null && (
        <button
          onClick={() => setActiveForm("instance")}
        >
          +
        </button>
      )}

      {activeForm === "instance" && (
        <AddInstanceForm
          patientId={patient.id}
          onAddTask={onAddTask}
          setActiveForm={setActiveForm}
        />
      )}

      {activeForm === "definition" && (
        <AddDefinitionForm
          patientId={patient.id}
          onAddDefinition={onAddDefinition}
          setActiveForm={setActiveForm}
        />
      )}

      {activeForm === "module" && (
        <AddModuleForm
          patient={patient}
          onAddModule={onAddModule}
          setActiveForm={setActiveForm}
        />
      )}

      {patient.taskInstances.length}

      {hours.map(hour => (
        <React.Fragment
          key={hour.getTime()}
        >
          <h3>
            {hour.toDateString()}
            {" - "}
            {hour.toLocaleTimeString([], {
              hour: "numeric"
            })}
          </h3>

          {patient.taskInstances
            .filter(task => 
              getHour(task.scheduledAt).getTime() ===
              hour.getTime()
            )
            .map(task => (
              <React.Fragment
                key={task.id}
              >
                <TaskItem
                  task={task}
                  handleTaskClick={() => handleTaskClick(task)} 
                />
              
                {activeTaskId === task.id && (
                  <TaskNoteEditor
                    task={task} 
                    onNoteChange={onNoteChange}
                  />
                )}
              </React.Fragment>
          ))}
        </React.Fragment>
      ))}

      
    </section>
  )
};