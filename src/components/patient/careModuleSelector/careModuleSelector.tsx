import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { CareModule } from "../../../types/careModule";

import styles from "./careModuleSelector.module.css";

interface CareModuleSelectorProps {
  careModules: CareModule[];
  selectedModuleIds: string[];
  onChange: (ids: string[]) => void;
};

export default function CareModuleSelector ({
  careModules,
  selectedModuleIds,
  onChange
}: CareModuleSelectorProps) {

  // =========================
  // Form State
  // =========================

  const [search, setSearch] = useState("");
  const [showModuleList, setShowModuleList] = useState(false);

  // =========================
  // Derived State
  // =========================

  const query = search.trim().toLowerCase();

  const selectedModules = careModules.filter(module => 
    selectedModuleIds.includes(module.id)
  );

  const availableModules: CareModule[] = careModules.filter(module => 
    !selectedModuleIds.includes(module.id) &&
    module.name.toLowerCase().includes(query)
  );

  function changeModule(id: string) {
    selectedModuleIds.includes(id) ?
      onChange(selectedModuleIds.filter(moduleId => moduleId !== id)) :
      onChange([...selectedModuleIds, id]);
    
    setSearch("");
  };

  return (
    <div className={styles.moduleSelector}>
      <input
        type="search"
        value={search}
        aria-label="Search care modules"
        placeholder="Search available modules..."
        onChange={event => setSearch(event.target.value)}
        onFocus={() => setShowModuleList(true)}
      />
      
      {showModuleList && (
        <div className={styles.moduleList}>
          {availableModules.map(module => (
            <button
              key={module.id}
              type="button"
              className={styles.moduleItem}
              onClick={() => changeModule(module.id)}
            >
              <span>{module.name}</span>
              <Plus size={18} />
            </button>
          ))}

          {availableModules.length === 0 && (
            <p>No available modules found.</p>
          )}
        </div>
      )}

      <div className={styles.moduleSection}>
        <div className={styles.sectionHeader}>
          <span>Selected Modules</span>
          <span>{selectedModules.length} selected</span>
        </div>

        <div className={styles.moduleList}>
          {selectedModules.map(module => (
            <button
              key={module.id}
              className={styles.selectedModule}
              onClick={() => changeModule(module.id)}
              aria-label={`Remove ${module.name}`}
            >
              <span>{module.name}</span>

              <X size={18} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};