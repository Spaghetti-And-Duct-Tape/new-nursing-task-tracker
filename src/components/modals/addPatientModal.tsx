import * as Dialog from "@radix-ui/react-dialog";
import styles from "./modal.module.css";
import { CircleAlert, Layers, Plus, X } from "lucide-react";
import React, { useState } from "react";
import { getCareModuleLibrary } from "../../data/getCareModuleLibrary";
import { getNurseConfig } from "../../utils/config/config";
import CareModuleSelector from "../patient/careModuleSelector/careModuleSelector";
import Expandable from "../utils/expandable";

interface Props {
  patientRooms: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPatient: (patient: {
    room: string,
    moduleIds: string[]
  }) => void;
};

export default function AddPatientModal({
  patientRooms,
  open,
  onOpenChange,
  onAddPatient
}: Props) {
  //All care modules
  const careModules = getCareModuleLibrary();
  //Care modules defaulted for every patient
  const defaultModules = getNurseConfig().modules;

  const [room, setRoom] = useState("");
  const [error, setError] = useState("");
  const [selectedModuleIds, setSelectedModuleIds] = 
    useState<string[]>(() => [...defaultModules]);

  function resetForm(resetModule = true) {
    setRoom("");
    setError("");

    if (resetModule)
      setSelectedModuleIds([...defaultModules]);
  };

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) resetForm();

    onOpenChange(isOpen)
  };

  function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const roomNumber = room.trim();
    const roomExists = patientRooms.some(
      existingRoom =>
        existingRoom.trim().toUpperCase() === roomNumber.toUpperCase() 
    );

    if (!roomNumber) return;
    if (roomExists)
      return setError(`Room ${roomNumber} is already assigned.`)

    const submitter = e.nativeEvent.submitter
    const continueAdding = 
      submitter instanceof HTMLButtonElement &&
      submitter.value === "continue";

    onAddPatient({
      room: roomNumber,
      moduleIds: selectedModuleIds
    });

    if (continueAdding) {
      resetForm(false);
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
              Add Patient
            </Dialog.Title>

            <Dialog.Close
              className={styles.closeButton}
              aria-label="Close"
            >
              <X size={20} />
            </Dialog.Close>
          </div>

          <Dialog.Description className={styles.description}>
            Add a patient to your current assignment.
          </Dialog.Description>

          <form 
            className={styles.form}
            onSubmit={handleSubmit}
          >
            <div className={styles.formContent}>
              <div className={styles.field}>
                <label htmlFor="patient-room">
                  Room Number
                </label>

                <input
                  id="patient-room"
                  type="text"
                  value={room}
                  onChange={(e) => {
                    setError("");
                    setRoom(e.target.value);
                  }}
                  placeholder="e.g. 12, 12A, ICU-04"
                  autoComplete="off"
                  aria-invalid={!!error}
                  aria-describedby={error ? "room-error" : undefined}
                  required
                />

                {error && (
                  <p
                    id="room-error" 
                    className={styles.fieldError}
                    role="alert"
                  >
                    <CircleAlert
                      size={14}
                      aria-hidden="true"
                    />
                    {error}
                  </p>
                )}
              </div>

              <Expandable
                title="Add Care Modules"
                icon={Layers}
              >
                <CareModuleSelector
                  careModules={careModules}
                  selectedModuleIds={selectedModuleIds}
                  onChange={setSelectedModuleIds}
                />
              </Expandable>
            </div>

            <div className={styles.actions}>
              <button
                type="submit"
                name="action"
                value="continue"
                className={styles.continueButton}
                disabled={!room.trim()}
              >
                Add & Continue
              </button>

              <button
                type="submit"
                name="action"
                value="finish"
                className={styles.submitButton}
                disabled={!room.trim()}
              >
                <Plus size={18} />
                Add Patient
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};