import * as Dialog from "@radix-ui/react-dialog";

import styles from "../modal.module.css";
import { ChevronDown, Info, Plus, Settings2 } from "lucide-react";
import { useState } from "react";
import type { Patient } from "../../../types/patient";
import type { TaskInstance } from "../../../types/task";
import { getDateTimeLocal } from "../../../utils/utils";
import { useAssignment } from "../../../hooks/AssignmentProvider";

function createInstance(patient: Patient): Omit<TaskInstance, "scheduledAt"> {
  return {
    id: crypto.randomUUID(),
    patientId: patient.id,
    name: "",
    workflow: "complete",
    category: "personal",
    source: "manual",
    completed: false,
    charted: false,
    note: ""
  };
};

export function AddInstanceForm({
  patient,
  onOpenChange
} : {
  patient: Patient,
  onOpenChange: (open: boolean) => void;
}) {
  const {addTaskInstance} = useAssignment();

  const [expanded, setExpanded] = useState(false);
  const [instance, setInstance] = useState(() =>
    createInstance(patient)
  );
  const [scheduledAt, setScheduledAt] = useState(
    () => getDateTimeLocal(new Date())
  );

  const isValid = 
    instance.name.trim() &&
    !Number.isNaN(new Date(scheduledAt).getTime());

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) resetForm();

    onOpenChange(isOpen)
  };

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const {name, value} = e.target;

    setInstance(prev => ({
      ...prev,
      [name]: value
    }));
  };

  function resetForm(preserveOptions = false) {
    const newInstance = createInstance(patient);
    
    setInstance(prev => ({
      ...newInstance,
      ...(preserveOptions && {
        category: prev.category,
        workflow: prev.workflow
      })
    }));

    setScheduledAt(getDateTimeLocal(new Date()));
  };

  function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    
    if (!isValid) return;

    const date = new Date(scheduledAt)

    const submitter = e.nativeEvent.submitter;
    const continueAdding =
      submitter instanceof HTMLButtonElement &&
      submitter.value === "continue";

    addTaskInstance({
      ...instance,
      name: instance.name.trim(),
      scheduledAt: date
    });

    if (continueAdding) {
      resetForm(true);
    } else {
      handleOpenChange(false);
    };
  };
  
  return (
    <>
      <Dialog.Description className={styles.description}>
        Create a one-time task for the patient in Room {patient.room}.
        <span className={styles.taskWarning}>
          <Info size={12} />
          One time tasks will not carry over to the next shift. 
        </span>
      </Dialog.Description>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <div className={styles.formContent}>
          <div className={styles.field}>
            <label htmlFor="task-name">
              Task Name
            </label>

            <input
              id="task-name"
              name="name"
              value={instance.name}
              onChange={handleChange}
              placeholder="e.g. Draw labs"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="task-time">
              Scheduled Time
            </label>

            <input
              id="task-time"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              type="datetime-local"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="task-note">
              Notes (optional)
            </label>

            <textarea
              id="task-note"
              name="note"
              value={instance.note}
              onChange={handleChange}
              placeholder="Additional details..."
            />
          </div>

          <div className={styles.moreOptions}>
            <button
              type="button"
              className={styles.moduleToggle}
              onClick={() => setExpanded(prev => !prev)}
              aria-expanded={expanded}
            >
              <span>
                <Settings2 size={16} />
                More Options
              </span>

              <ChevronDown
                size={18}
                className={expanded ? styles.chevronOpen : ""}
              />
            </button>

            {expanded && (
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label htmlFor="task-category">
                    Category
                  </label>
                      
                  <select
                    id="task-category"
                    name="category"
                    value={instance.category}
                    onChange={handleChange}
                  >
                    <option value="medication">Medication</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor="task-workflow">
                    Tracking
                  </label>
                  <select
                    id="task-workflow"
                    name="workflow"
                    value={instance.workflow}
                    onChange={handleChange}
                  >
                    <option value="complete">Mark as Done</option>
                    <option value="chart">Mark as Charted</option>
                    <option value="complete-and-chart">
                      Done, Then Charted
                    </option>
                  </select>
               </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            name="action"
            value="continue"
            className={styles.continueButton}
            disabled={!isValid}
          >
            Add & Continue
          </button>

          <button
            type="submit"
            name="action"
            value="finish"
            className={styles.submitButton}
            disabled={!isValid}
          >
            <Plus size={18} />
            Add Task
          </button>
        </div>
      </form>
    </>
  )
};