import { useState } from "react"
import type { CareModule } from "../../types/careModule";
import { core } from "../../data/modules/core";
import { bloodTransfusion } from "../../data/modules/bloodTransfusion";
import { taysCore } from "../../data/modules/taysCore";
import type { Patient } from "../../types/patient";

interface AddModuleFormProps {
  patient: Patient
  onAddModule: (
    patientId: string,
    module: CareModule
  ) => void;
  setActiveForm: React.Dispatch<
    React.SetStateAction<"module" | "definition" | "instance" | null>
  >
}

const careModules: CareModule[] = [
  core,
  bloodTransfusion,
  taysCore
];

export function AddModuleForm({
  patient,
  onAddModule,
  setActiveForm
}: AddModuleFormProps) {
  const [search, setSearch] = useState("");
  const [modules, setModules] = useState<CareModule[]>([]);

  const filteredModules = careModules.filter(module => 
    module.name.toLowerCase().includes(
      search.trim().toLowerCase()
    ) &&
    !patient.modules.some(
      patientModule => patientModule.moduleId === module.id 
      && patientModule.persistent
    )
  );

  function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    modules.forEach(module => 
      onAddModule(patient.id, module)
    );

    setModules([]);
    setSearch("");
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

      <h2>Add Care Module</h2>

      <input
        type="text"
        placeholder="Search care modules..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {filteredModules.map(module => (
        <button
          type="button"
          key={module.id}
          onClick={() => setModules(prev =>
            prev.some(m => m.id === module.id)
              ? prev.filter(m => m.id !== module.id)
              : [...prev, module]
          )}
        >
          {modules.some(m => m.id === module.id) ? "✓ " : "+ "}
          {module.name}
        </button>
      ))}

      <button type="submit">
        Add Module
      </button>

    </form>
  )
};