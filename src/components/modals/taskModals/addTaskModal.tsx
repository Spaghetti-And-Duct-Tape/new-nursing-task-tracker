import * as Dialog from "@radix-ui/react-dialog";

import styles from "../modal.module.css";
import { CalendarCheck, Repeat, X } from "lucide-react";
import type { Patient } from "../../../types/patient";
import { AddInstanceForm } from "./addInstanceForm";
import { useState } from "react";
import { AddDefinitionForm } from "./addDefinitionForm";

export type TaskFormProps = {
  patient: Patient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddTaskModal({
  patient,
  open,
  onOpenChange,
}: TaskFormProps) {
  const [taskType, setTaskType] = useState<"one-time" | "recurring">("one-time");

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />

        <Dialog.Content className={styles.modal}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>
              Add Task · Room {patient.room}
            </Dialog.Title>

            <Dialog.Close
              className={styles.closeButton}
              aria-label="Close"
            >
              <X size={20} />
            </Dialog.Close>
          </div>

          <div className={styles.taskTypeSelector}>
            <button
              type="button"
              className={taskType === "one-time" ? styles.selected : ""}
              onClick={() => setTaskType("one-time")}
            >
              <CalendarCheck size={18} />
              One-Time
            </button>

            <button
              type="button"
              className={taskType === "recurring" ? styles.selected : ""}
              onClick={() => setTaskType("recurring")}
            >
              <Repeat size={18} />
              Recurring
            </button>
          </div>

          {taskType === "one-time" ? (
            <AddInstanceForm
              patient={patient}
              onOpenChange={onOpenChange}
            />
          ) : (
            <AddDefinitionForm
              patient={patient}
              onOpenChange={onOpenChange}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
};