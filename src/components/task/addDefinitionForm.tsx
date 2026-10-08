import { useState } from "react";
import type { TaskCategory, TaskDefinition, TaskWorkflow } from "../../types/task";
import type { TimeString } from "../../types/time";

interface AddDefinitionFormProps {
  patientId: string;
  onAddDefinition: (
    patientId: string,
    definition: TaskDefinition,
    persistent: boolean
  ) => void;
  setActiveForm: React.Dispatch<
    React.SetStateAction<"module" | "definition" | "instance" | null>
  >;
};

interface TaskDefinitionForm {
  name: string;
  category: TaskCategory
  workflow: TaskWorkflow;
  offset: number,
  interval: number,
  repeat: number,
  persistent: boolean
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
    offset: 0,
    interval: 0,
    repeat: 1,
    persistent: true
  });

  const [timesInput, setTimesInput] = useState("");

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

  function toTimeString(
    value: string
  ): TimeString | "now" | null {
    const time = value.trim().toLowerCase();

    if (time === "now") return "now";

    const match = time.match(
      /^(\d{1,2}):(\d{1,2})$|^(\d{1,2})(\d{2})?$/
    );

    if (!match) return null;

    const hours = Number(match[1] ?? match[3]);
    const minutes = Number(match[2] ?? match[4] ?? 0);

    if (
      hours > 23
      || minutes > 59
    ) return null;

    return `${
      String(hours).padStart(2, "0")
    }:${
      String(minutes).padStart(2, "0")
    }` as TimeString;
  };

  function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!definition.name.trim()) return;

    const times = timesInput
      .split(",")
      .map(toTimeString);

    const task: TaskDefinition = {
      id: crypto.randomUUID(),
      name: definition.name.trim(),

      category: definition.category,
      workflow: definition.workflow,

      schedule: {
        times: times.filter(
          (time): time is TimeString | "now" => time !== null
        ),
        offset: definition.offset,
        interval: definition.interval,
        repeat: definition.repeat,
      }
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

      <h2>Add Routine Task</h2>

      <input
        name="name"
        placeholder="Task Name"
        value={definition.name}
        onChange={handleChange}
      />

      <input
        name="times"
        placeholder="Times"
        value={timesInput}
        onChange={(e) => 
          setTimesInput(e.target.value)
        }
      />

      <input
        name="interval"
        placeholder="Interval"
        value={definition.interval}
        onChange={handleChange} 
      />

      
      <input
        name="repeat"
        placeholder="Repeat"
        value={definition.repeat}
        onChange={handleChange} 
      />

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