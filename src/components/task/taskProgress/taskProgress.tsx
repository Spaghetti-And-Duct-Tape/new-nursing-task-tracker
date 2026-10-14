import { AlertTriangle, Check } from "lucide-react";
import styles from "./taskProgress.module.css";

interface TaskProgressProps {
  identifier: string;
  completedTaskCount: number;
  taskCount: number;
  overdueTaskCount: number
};

export default function TaskProgress({
  identifier,
  completedTaskCount,
  taskCount,
  overdueTaskCount
}: TaskProgressProps) {
  const progress = taskCount > 0 ?
    Math.round((completedTaskCount / taskCount) * 100) :
    0;

  return (
    <div className={styles.progressBar}>
      <div className={styles.progressHeader}>
        <span>{progress}% Complete</span>

        <span
          className={
            overdueTaskCount > 0 ?
              styles.overdue :
              styles.noOverdue
          }
        >
          {overdueTaskCount > 0 ? (
            <>
              <AlertTriangle size={14} />
              {overdueTaskCount} overdue
            </>
          ) : (
            <>
              <Check size={14} />
              No overdue
            </>
          )}
        </span>
      </div>

      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label={`${identifier} task progress`}
        aria-valuemin={0}
        aria-valuemax={taskCount}
        aria-valuenow={progress}
      >
        <div
          className={styles.progressFill}
          style={{width: `${progress}%`}}
        />
      </div>
    </div>
  )
};