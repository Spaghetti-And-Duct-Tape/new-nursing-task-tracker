import * as Dialog from "@radix-ui/react-dialog";

import styles from "../modal.module.css";
import { ChevronDown, Plus, X } from "lucide-react";
import { useState } from "react";
import type { Patient } from "../../../types/patient";
import type { TaskWorkflow, TaskInstance, TaskCategory } from "../../../types/task";
import { getCurrentDateTimeLocal } from "../../../utils/utils";

type Props = {
  patient: Patient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: TaskInstance) => void;
}

export default function AddTaskModal({
  patient,
  open,
  onOpenChange,
  onAddTask
}: Props) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [scheduledAt, setScheduledAt] = 
    useState(() => getCurrentDateTimeLocal());
  const [workflow, setWorkflow] = useState<TaskWorkflow>("complete");
  const [category, setCategory] = useState<Exclude<TaskCategory, "chart">>("personal");

  const [expanded, setExpanded] = useState(false);

  function resetForm() {
    setName("");
    setScheduledAt(getCurrentDateTimeLocal());
    setNote("");
  };

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) resetForm();
    
    onOpenChange(isOpen);
  };
  
  function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    const trimmedName = name.trim()

    if (!trimmedName || !scheduledAt) return;

    const submitter = e.nativeEvent.submitter;
    const continueAdding =
      submitter instanceof HTMLButtonElement &&
      submitter.value === "continue";

    const task: TaskInstance = {
      id: crypto.randomUUID(),
      definitionId: crypto.randomUUID(),
      patientId: patient.id,
      name: trimmedName,
      scheduledAt: new Date(scheduledAt),
      workflow: "complete",
      category: "personal",
      source: "manual",
      completed: false,
      charted: false,
      note: note.trim()
    };

    onAddTask(task);

    if (continueAdding) {
      resetForm();
    } else {
      handleOpenChange(false);
    };
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />

        <Dialog.Content className={styles.modal}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>
              Add Task
            </Dialog.Title>

            <Dialog.Close
              className={styles.closeButton}
              aria-label="Close"
            >
              <X size={20} />
            </Dialog.Close>
          </div>

          <Dialog.Description className={styles.description}>
            Add a one time task to this patient's assignment.
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="task-note">
                  Notes (optional)
                </label>

                <textarea
                  id="task-note"
                  value={note}
                  onChange={event => setNote(event.target.value)}
                  placeholder="Additional details..."
                />
              </div>

              <div className="">
                <button
                  type="button"
                  className={styles.moduleToggle}
                  onClick={() => setExpanded(prev => !prev)}
                  aria-expanded={expanded}
                >
                  <span>
                    More Options
                  </span>
                  <ChevronDown
                    size={18}
                    className={expanded ? styles.chevronOpen : ""}
                  />
                </button>
                {expanded && (
                  <>
                    <div className={styles.field}>
                      <label htmlFor="workflow">
                        How to track this task?
                      </label>
                      <p className={styles.fieldHint}>
                        What happens when you tap the task.
                      </p>
                      
                      <select
                        id="task-workflow"
                        value={workflow}
                        onChange={(e) =>
                          setWorkflow(
                            e.target.value as TaskWorkflow
                          )
                        }
                      >
                        <option value="complete">Mark as Done</option>
                        <option value="chart">Mark as Charted</option>
                        <option value="complete-and-chart">
                          Done, Then Charted
                        </option>
                      </select>
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="task-category">
                        Task Category
                      </label>
                      <p className={styles.fieldHint}>
                        Choose where this task appears in your filters.
                      </p>
                      
                      <select
                        id="task-category"
                        value={category}
                        onChange={(e) =>
                          setCategory(
                            e.target.value as Exclude<TaskCategory, "chart">
                          )
                        }
                      >
                        <option value="medication">Medication</option>
                        <option value="personal">Personal</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className={styles.actions}>
              <button
                type="submit"
                name="action"
                value="continue"
                className={styles.continueButton}
                disabled={!name.trim() || !scheduledAt}
              >
                Add & Continue
              </button>

              <button
                type="submit"
                name="action"
                value="finish"
                className={styles.submitButton}
                disabled={!name.trim() || !scheduledAt}
              >
                <Plus size={18} />
                Add Task
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
};