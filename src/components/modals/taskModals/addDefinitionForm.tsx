import * as Dialog from "@radix-ui/react-dialog";

import styles from "../modal.module.css";
import type { Patient } from "../../../types/patient";
import { Fragment, useState } from "react";
import { useAssignment } from "../../../hooks/AssignmentProvider";
import type { TaskWorkflow, TaskCategory, TaskDefinition } from "../../../types/task";
import { CalendarClock, CircleAlert, Clock3, Plus } from "lucide-react";
import { getMaxRepeat, getTimeString, toTimeString } from "../../../utils/utils";
import type { TimeString } from "../../../types/time";
import { schedulePresets } from "../../../data/shedulePresets";
import { generateScheduledTimes } from "../../../utils/scheduling/generateTasks";
import Expandable from "../../utils/expandable";

export function AddDefinitionForm({
  patient,
  onOpenChange
}: { 
  patient: Patient,
  onOpenChange: (open: boolean) => void;
}) {
  const {assignment, addTaskDefinition} = useAssignment();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<TaskCategory>("medication");
  const [workflow, setWorkflow] = useState<TaskWorkflow>("chart");
  const [times, setTimes] = useState(() => [{
    id: crypto.randomUUID(),
    value: ""
  }
  ]);
  const [interval, setInterval] = useState<number | "">(1);
  const [intervalUnit, setIntervalUnit] = useState<"minutes" | "hours">("hours");
  const [repeat, setRepeat] = useState<number | "">(1);

  const [error, setError] = useState({
    name: "",
    message: ""
  });

  const intervalMinutes = 
    (Number(interval) || 1) * (intervalUnit === "hours" ? 60 : 1);

  const currentTimes = times
    .filter(time => time.value.trim() !== "");

  const validTimes = currentTimes
    .map(time => toTimeString(time.value))
    .filter((time): time is TimeString => time !== null);

  const selectedPreset = 
    schedulePresets.find(preset => 
      interval === preset.interval &&
      intervalUnit === preset.intervalUnit &&
      repeat === preset.repeat &&
      currentTimes.length === preset.times.length &&
      currentTimes.every(time => 
        preset.times.some(
          presetTime => presetTime === toTimeString(time.value)
        )
      )
    )?.id ?? "custom";

  const previewTimes = generateScheduledTimes({
    times: currentTimes
      .map(time => toTimeString(time.value))
      .filter((time): time is TimeString => time !== null),
    offset: 0,
    interval: intervalMinutes,
    repeat: repeat || 1
  }, assignment.shiftStart, assignment.shiftEnd)

  const maxRepeat = getMaxRepeat(
    validTimes,
    intervalMinutes,
    assignment.shiftStart,
    assignment.shiftEnd
  );

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) resetForm();

    onOpenChange(isOpen)
  };

  function resetForm(preserveOptions = false) {
    setError({
      name: "",
      message: ""
    })
    setName("");
    setTimes([{
        id: crypto.randomUUID(),
        value: getTimeString(assignment.shiftStart)
      }, {
        id: crypto.randomUUID(),
        value: ""
    }]);

    setInterval(0);
    setRepeat(1);

    if (!preserveOptions) {
      setCategory("medication");
      setIntervalUnit("hours");
    };
  };


  function validateForm() {
    if (!name.trim())
      return {
        name: "name",
        message: "Please enter a task name."
      };

    if (currentTimes.length === 0)
      return {
        name: "times",
        message: "Please enter at least one time."
      };

    const invalidTime = currentTimes.find(
      time => toTimeString(time.value) === null
    );

    if (invalidTime)
      return {
        name: `time ${invalidTime.id}`,
        message: "Value must be a valid time."
      };

    if (interval === "" || !Number.isInteger(interval) || interval < 0)
      return {
        name: "interval",
        message: "Interval must be a non-negative whole number."
      };

    if (repeat === "" || !Number.isInteger(repeat) || repeat < 1)
      return {
        name: "repeat",
        message: "Repeat must be at least 1."
      };

    return null;
  };

  function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError)
      return setError(validationError);

    const taskDefinition: TaskDefinition = {
      id: crypto.randomUUID(),
      name: name.trim(),
      category,
      workflow,
      schedule: {
        times: validTimes,
        offset: 0,
        interval: intervalMinutes,
        repeat: repeat || 1
      }
    };

    const submitter = e.nativeEvent.submitter;
    const continueAdding = 
      submitter instanceof HTMLButtonElement &&
      submitter.value === "continue";

    addTaskDefinition(patient.id, taskDefinition);

    if (continueAdding) {
      resetForm(true);
    } else {
      handleOpenChange(false);
    }
  };

  function handleTimeChange(id: string, value: string) {
    setTimes(prev => {
      const updated = prev.map(time => 
        time.id === id
          ? {...time, value}
          : time
      );

      const filledTimes = updated.filter(
        time => time.value.trim() !== ""
      );

      return [
        ...filledTimes,
        {id: crypto.randomUUID(), value: ""}
      ];
    })
  };

  function handleIntervalChange(
    newInterval: number | "",
    newUnit: "minutes" | "hours"
  ) {
    if (newInterval === "") 
      return setError({
        name: "interval",
        message: "Interval must be a non-negative whole number."
      });
    const intervalMinutes =
      newUnit === "hours" ? newInterval * 60 : newInterval;
      
    setInterval(newInterval);
    setIntervalUnit(newUnit);
      
    setRepeat(
      getMaxRepeat(
        validTimes,
        intervalMinutes,
        assignment.shiftStart,
        assignment.shiftEnd
      )
    );
  };

  function applyPreset(presetId: string) {
    const preset = schedulePresets.find(
      preset => preset.id === presetId
    );

    if (!preset) return;

    setTimes([
      ...preset.times.map(value => ({
        id: crypto.randomUUID(),
        value
      })), {
        id: crypto.randomUUID(),
        value: ""
      }
    ]);

    setInterval(preset.interval);
    setIntervalUnit(preset.intervalUnit);
    setRepeat(preset.repeat);
  };

  return (
    <>
      <Dialog.Description className={styles.description}>
        Create a recurring task for the patient in Room {patient.room}.
      </Dialog.Description>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <div className={styles.formContent}>

          {/* TASK DETAILS */}
          <section className={styles.section}>
            <div className={styles.field}>
              <label htmlFor="task-name">
                Task Name*
              </label>

              <input
                id="task-name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Insulin"
                required
                aria-describedby={
                  error.name === "name" ? "name-error" : undefined
                }
              />

              {error.name === "name" && (
                <p
                  id="name-error"
                  className={styles.fieldError}
                  role="alert"
                >
                  <CircleAlert
                    size={14}
                    aria-hidden="true"
                  />
                  {error.message}
                </p>
              )}
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label htmlFor="task-category">
                  Category*
                </label>

                <select
                  id="task-category"
                  name="category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as TaskCategory)
                  }
                >
                  <option value="medication">
                    Medication
                  </option>
                  <option value="personal">Personal</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="task-workflow">
                  Completion Type*
                </label>

                <select
                  id="task-workflow"
                  name="workflow"
                  value={workflow}
                  onChange={(e) => setWorkflow(e.target.value as TaskWorkflow)}
                >
                  <option value="complete">Complete (1 Click)</option>
                  <option value="chart">Chart (1 Click)</option>
                  <option value="complete-and-chart">Complete + Chart (2 Clicks)</option>
                </select>
              </div>
            </div>
          </section>

          {/* SCHEDULED TIMES */}
          <section className={styles.section}>
            <div className={styles.field}>
              <label htmlFor="task-preset">
                Schedule Preset
              </label>

              <select
                id="task-preset"
                value={selectedPreset}
                onChange={(e) => applyPreset(e.target.value)}
              >
                {schedulePresets.map(preset => (
                  <option 
                    key={preset.id}
                    value={preset.id}
                  >
                    {preset.label}
                  </option>
                ))}

                <option 
                  value="custom"
                  disabled
                >
                  Custom
                </option>
              </select>
            </div>

            <div className={styles.field}>
              <label>
                {repeat === "" || repeat < 2 ? "Task Time(s)" : "Start Time(s)"}
              </label>

              <div className={styles.timeInputs}>
                {times.map(time => (
                  <Fragment key={time.id}>
                    <div className={styles.timeRow}>
                      <input
                        id={`task-time-${time.id}`}
                        value={time.value}
                        onChange={(e) =>
                          handleTimeChange(time.id, e.target.value)
                        }
                        placeholder="e.g. now, hour, 7, 0700, 18:00"
                        aria-label="Scheduled time"
                        aria-describedby={
                          error.name === `time ${time.id}`
                            ? `time-error-${time.id}`
                            : undefined
                        }
                      />
                    </div>

                    {error.name === `time ${time.id}` && (
                      <p
                        id={`time-error-${time.id}`}
                        className={styles.fieldError}
                        role="alert"
                      >
                        <CircleAlert
                          size={14}
                          aria-hidden="true"
                        />
                        {error.message}
                      </p>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </section>

          <Expandable
            title="Customize Schedule"
            icon={Clock3}
          >
            <div className={styles.advancedContent}>
              <div className={styles.field}>
                <label htmlFor="task-interval">
                  Repeat Every
                </label>

                <div className={styles.intervalInput}>
                  <input
                    id="task-interval"
                    type="number"
                    min={1}
                    step={1}
                    value={interval}
                    onChange={(e) =>
                      handleIntervalChange(
                        e.target.value === "" ? "" : Number(e.target.value), 
                        intervalUnit
                      )
                    }
                    aria-describedby={
                      error.name === "interval"
                        ? "interval-error"
                        : undefined
                    }
                  />

                  <select
                    value={intervalUnit}
                    onChange={(e) =>
                      handleIntervalChange(
                        interval || 1, 
                        e.target.value as "minutes" | "hours"
                      )
                    }
                    aria-label="Interval unit"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                  </select>
                </div>

                {error.name === "interval" && (
                  <p
                    id="interval-error"
                    className={styles.fieldError}
                    role="alert"
                  >
                    <CircleAlert
                      size={14}
                      aria-hidden="true"
                    />
                    {error.message}
                  </p>
                )}
              </div>
              
              <div className={styles.field}>
                <div className={styles.repeatHeader}>
                  <label htmlFor="task-repeat">
                    Number of Occurrences
                  </label>

                  <input
                    id="task-repeat"
                    type="number"
                    min={1}
                    max={maxRepeat}
                    step={1}
                    value={repeat}
                    onChange={(e) =>
                      setRepeat(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    aria-describedby={
                      error.name === "repeat"
                        ? "repeat-error"
                        : undefined
                    }
                  />
                </div>

                <div className={styles.repeatSlider}>
                  <input
                    type="range"
                    min={1}
                    max={Math.max(1, maxRepeat)}
                    step={1}
                    value={Math.min(
                      repeat || 1,
                      Math.max(1, maxRepeat)
                    )}
                    onChange={(e) =>
                      setRepeat(Number(e.target.value))
                    }
                    disabled={maxRepeat <= 1}
                    aria-label="Number of occurrences"
                  />

                  <div className={styles.sliderLabels}>
                    <span>1</span>
                    <span>{maxRepeat}</span>
                  </div>
                </div>

                {error.name === "repeat" && (
                  <p
                    id="repeat-error"
                    className={styles.fieldError}
                    role="alert"
                  >
                    <CircleAlert
                      size={14}
                      aria-hidden="true"
                    />
                    {error.message}
                  </p>
                )}
              </div>
            </div> 
          </Expandable>

          <Expandable
            title="Preview Schedule"
            icon={CalendarClock}
          >
            <div className={styles.previewTimes}>
              {previewTimes.map((time, index) => (
                <span
                  key={`${time.getTime()}-${index}`}
                  className={styles.previewTime}
                >
                  {getTimeString(time)}
                </span>
              ))}
            </div>
          </Expandable>
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            name="action"
            value="continue"
            className={styles.continueButton}
            disabled={!name.trim()}
          >
            Add & Continue
          </button>

          <button
            type="submit"
            name="action"
            value="finish"
            className={styles.submitButton}
            disabled={!name.trim()}
          >
            <Plus size={18} />
            Add Task
          </button>
        </div>
      </form>
    </>
  );
};