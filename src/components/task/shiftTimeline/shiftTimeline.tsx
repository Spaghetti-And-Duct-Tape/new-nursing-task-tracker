import { useCurrentDate } from "../../../hooks/DateProvider";
import type { TaskInstance } from "../../../types/task";
import { minuteMs } from "../../../utils/utils";

import styles from "./shiftTimeline.module.css";
import { currentHourTasks, isOverdue, isTaskFinished, organizeTasks } from "../../../utils/tasks/organizeTasks";

interface Props {
  tasks: TaskInstance[];
  shiftStart: Date;
  shiftEnd: Date;
  selectedHour: number | "all";
  onSelectedHour: (hour: number | "all") => void;
}

export default function ShiftTimeLine({
  tasks,
  shiftStart,
  shiftEnd,
  selectedHour,
  onSelectedHour
}: Props) {
  const now = useCurrentDate();

  const hours: Date[] = [];
  
  const startOnHour = new Date (shiftStart);
  startOnHour.setMinutes(0, 0, 0);

  for (
    let time = startOnHour.getTime();
    time < shiftEnd.getTime();
    time += 60 * minuteMs
  ) {

    hours.push(new Date(time))
  };

  return (
    <div className={styles.timeline}>
      <div className={styles.hourList}>
        <button
          type="button"
          className={`${styles.hourButton} ${
            selectedHour === "all" ? styles.selected : ""
          }`}
          onClick={() => onSelectedHour("all")}
        >
          <span>All</span>
          <span className={styles.count}>
            {tasks.filter(task => !isTaskFinished(task)).length}
          </span>
        </button>

        {hours.map(hour => (
          <HourButton
            now={now}
            hour={hour}
            selectedHour={selectedHour}
            onSelectedHour={onSelectedHour}
            tasks={tasks}
          />
        ))}
      </div>
    </div>
  )
};

function HourButton({
  now,
  hour,
  selectedHour,
  onSelectedHour,
  tasks
}: {
  now: Date;
  hour: Date;
  selectedHour: number | "all";
  onSelectedHour: (hour: number | "all") => void;
  tasks: TaskInstance[]
}) {
  const hourTasks = currentHourTasks(tasks, hour);
  const remainingTasks = hourTasks.filter(
    task => !isTaskFinished(task)
  );
  const hasOverdue = remainingTasks.some(
    task => isOverdue(task, now)
  );
  const hourNumber = hour.getHours();

  return (
    <button
      key={hour.toISOString()}
      type="button"
      className={`${styles.hourButton} ${
        selectedHour === hourNumber ? styles.selected : ""
      }`}
      onClick={() => onSelectedHour(hourNumber)}
    >
      <span>
        {String(hourNumber).padStart(2, "0")}
      </span>

      <span
        className={`${styles.count} ${
          hasOverdue ? styles.overdue : ""
        }`}
      >
        {remainingTasks.length}
      </span>
    </button>
  )
};