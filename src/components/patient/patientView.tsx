import React, { useState } from "react";
import type { Patient } from "../../types/patient";
import type { TaskInstance } from "../../types/task";
import { TaskItem } from "../task/taskItem";
import { TaskNoteEditor } from "../task/taskNoteEditor";
import { AddInstanceForm } from "../task/addInstanceForm";
import { getHour } from "../../utils/utils";

interface PatientViewProps {
  patient: Patient;
  onTaskClick: (task: TaskInstance) => void;
  onAddTask: (task: TaskInstance) => void;
  onNoteChange: (
    task: TaskInstance,
    note: string 
  ) => void;
}

export function PatientView({
  patient,
  onTaskClick,
  onAddTask,
  onNoteChange
}: PatientViewProps) {
  const [activeTaskId, setActiveTaskId] = useState<
    string | null
  > (null);

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

      <AddInstanceForm
        patientId={patient.id}
        onAddTask={onAddTask}
      />

      {patient.taskInstances.length}

      {hours.map(hour => (
        <React.Fragment
          key={hour.getTime()}
        >
          <h3>
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

/*

{patient.taskInstances.map((task) => (
        <React.Fragment
          key={task.id}
        >
          <TaskItem
            task={task}
            onClick={() => handleTaskClick(task)} 
          />

          {activeTaskId === task.id && (
            <TaskNoteEditor
              task={task} 
              onNoteChange={onNoteChange}
            />
          )}
        </React.Fragment>
      ))}

*/