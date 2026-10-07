import { useState } from "react";
import type { TaskCategory, TaskDefinition, TaskWorkflow } from "../../types/task";

interface AddDefinitionFormProps {
  patientId: string;
  onAddDefinition: (
    patientId: string,
    definition: TaskDefinition,
    persistent: boolean
  ) => void;
  setActiveForm: React.Dispatch<
    React.SetStateAction<"definition" | "instance" | null>
  >;
};

interface TaskDefinitionForm {
  name: string;
  category: TaskCategory
  workflow: TaskWorkflow;
  type: "frequency" | "timed";
  times: string[];
  hours: number;
  anchorTime: string;
  persistent: boolean;
};

export function AddDefinitionForm({
  patientId,
  onAddDefinition,
  setActiveForm
}: AddDefinitionFormProps) {
  const [definition, setDefinition] = useState<TaskDefinitionForm>({
    name: "",
    category: "medication",
    workflow: "chart",
    type: "frequency",
    times: [],
    hours: 4,
    anchorTime: "00:00",
    persistent: true
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setDefinition(prev => ({
      ...prev,
      [e.target.name]: 
        e.target.name === "hours"
          ? Number(e.target.value)
          : e.target.value
    }));
  };

  function handleTimes(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setDefinition(prev => {
      const times = e.target.value
        .split(",")
        .map(time => time.trim());

        return {
          ...prev,
          times
        }
    });
  };

  function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    if (!definition.name.trim()) return;

    const schedule = 
      definition.type === "frequency"
        ? {
          type: "frequency" as const,
          hours: definition.hours,
          anchorTime: definition.anchorTime
        }
        : {
          type: "timed" as const,
          times: definition.times
        };

    const task: TaskDefinition = {
      id: crypto.randomUUID(),
      name: definition.name.trim(),

      category: definition.category,
      workflow: definition.workflow,

      schedule
    };
    
    onAddDefinition(
      patientId,
      task,
      definition.persistent
    );

    setDefinition(prev => ({
      ...prev,
      name: ""
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}
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
      >
        <button
          style={{
            width: "50%"
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
            width: "50%"
          }}
          onClick={() => 
            setActiveForm("definition")
          }
          type="button"
        >
          Routine
        </button>
      </div>

      <h2>Add Routine Task</h2>

      <input
        name="name"
        placeholder="Task Name"
        value={definition.name}
        onChange={handleChange}
      />

      <select
        name="type"
        value={definition.type}
        onChange={handleChange}
      >
        <option 
          value="frequency"
        >
          Frequency
        </option>
        <option 
          value="timed"
        >
          Timed
        </option>
      </select>

      {definition.type === "timed" && (
        <input
          placeholder="Times"
          value={definition.times.join(", ")}
          onChange={handleTimes}
        />
      )}

      {definition.type === "frequency" && (
        <>
          <input
            name="hours"
            placeholder="Frequency"
            value={definition.hours}
            onChange={handleChange}
          />

          <input
            type="time"
            name="anchorTime"
            placeholder="Frequency"
            value={definition.anchorTime}
            onChange={handleChange}
          />
        </>
      )}

      <label>
        <input
          type="checkbox"
          checked={definition.persistent}
          onChange={(e) => 
            setDefinition(prev => ({
              ...prev,
              persistent: e.target.checked
            }))
          }
        />
        Remember for future shifts
      </label>

      <button type="submit">
        Add Task
      </button>
    </form>
  );
};