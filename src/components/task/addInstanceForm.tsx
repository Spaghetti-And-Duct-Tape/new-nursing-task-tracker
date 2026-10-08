import { useState } from "react";
import type { TaskCategory, TaskInstance, TaskWorkflow } from "../../types/task";
import { createTaskId } from "../../utils/tasks/createTaskId";
import { toDateTimeLocal } from "../../utils/utils";

interface AddInstanceFormProps {
  patientId: string;
  onAddTask: (task: TaskInstance) => void;
  setActiveForm: React.Dispatch<
    React.SetStateAction<"module" | "definition" | "instance" | null>
  >;
};

interface TaskInstanceForm {
  name: string;
  category: TaskCategory;
  workflow: TaskWorkflow;
  scheduledAt: string;
  note: string;
}

export function AddInstanceForm({
  patientId,
  onAddTask,
  setActiveForm
}: AddInstanceFormProps) {
  const [instance, setInstance] = useState<TaskInstanceForm>({
    name: "",
    category: "chart",
    workflow: "chart",
    scheduledAt: toDateTimeLocal(new Date()),
    note: ""
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setInstance(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    
    if (!instance.name.trim()) return;

    const task: TaskInstance = {
      id: crypto.randomUUID(),
      definitionId: createTaskId(instance.name),
      patientId,

      name: instance.name.trim(),
      source: "manual",

      scheduledAt: new Date(instance.scheduledAt),
      note: instance.note.trim() || undefined,

      completed: false,
      charted: false,

      category: instance.category,
      workflow: instance.workflow
    };

    onAddTask(task);
    setInstance(prev => ({
      ...prev,
      name: "",
      note: ""
    }));
  };

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }} 
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        onClick={() => 
          setActiveForm(null)
        }
      >
        x
      </button>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          flexShrink: 0
        }}
      ><button
          style={{
            width: "33%"
          }}
          onClick={() => 
            setActiveForm("instance")
          }
          type="button"
        >
          One Time
        </button>
        <button
          style={{
            width: "33%"
          }}
          onClick={() => 
            setActiveForm("definition")
          }
          type="button"
        >
          Routine
        </button>
        <button
          style={{
            width: "33%"
          }}
          onClick={() => 
            setActiveForm("module")
          }
          type="button"
        >
          Module
        </button>
      </div>

      <h2>Add One Time Task</h2>

      <input
        name="name"
        placeholder="Task Name"
        value={instance.name}
        onChange={handleChange}
      />

      <input
        name="scheduledAt"
        placeholder="Scheduled Time"
        type="datetime-local"
        value={instance.scheduledAt}
        onChange={handleChange}
      />

      <input
        name="note"
        placeholder="Note"
        value={instance.note}
        onChange={handleChange}
      />

      <button type="submit">
        Add Task
      </button>
    </form>
  )
};