import { CheckCircle2Icon, ClipboardList, TriangleAlert, Users } from "lucide-react";
import { useCurrentDate } from "../../../hooks/DateProvider";
import type { Patient } from "../../../types/patient";
import { organizeTasks } from "../../../utils/tasks/organizeTasks";
import TaskProgress from "../../task/taskProgress/taskProgress";
import styles from "./assignmentStats.module.css";

interface Props {
  patients: Patient[];
}

export function AssignmentStats({
  patients
}: Props) {
  const now = useCurrentDate();
  const tasks = patients.flatMap(patient => patient.taskInstances);
  const organizedTasks = organizeTasks(now, tasks);

  const completedTasks = tasks.length - organizedTasks.remainingTasks.length;

  return (
    <div className={styles.assignmentHeader}>
      <div className={styles.assignmentBar}>
        <TaskProgress
          identifier="Assignment Tasks"
          taskCount={tasks.length}
          overdueTaskCount={organizedTasks.overdueTasks.length}
          completedTaskCount={completedTasks}
        />
      </div>

      <div className={styles.stat}>
        <div className={styles.statValue}>
          <span>{patients.length}</span>
          <Users />
        </div>
        <p>Patients</p>
      </div>

      <div className={styles.stat}>
        <div className={styles.statValue}>
          <span>{tasks.length}</span>
          <ClipboardList />
        </div>
        <p>Total</p>
      </div>

      <div className={styles.stat}>
        <div className={styles.statValue}>
          <span>{completedTasks}</span>
          <CheckCircle2Icon />
        </div>
        <p>Completed</p>
      </div>

      <div className={styles.stat}>
        <div className={styles.statValue}>
          <span>{organizedTasks.overdueTasks.length}</span>
          <TriangleAlert />
        </div>
        <p>Overdue</p>
      </div>
    </div>
  )
};