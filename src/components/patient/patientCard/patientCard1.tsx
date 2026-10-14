import { ChevronRight, Clock3, Layers3, Plus, Trash2 } from "lucide-react";
import type { Patient } from "../../../types/patient";
import styles from "./patientCard.module.css";
import TaskCategories from "../../task/taskCategories/taskCategories";
import { organizeTasks } from "../../../utils/tasks/organizeTasks";
import TaskProgress from "../../task/taskProgress/taskProgress";
import TaskItems from "../../task/taskItems/taskItems";
import { useCurrentDate } from "../../../hooks/DateProvider";

interface PatientCardPorps {
  patient: Patient
};

export default function PatientCard({
  patient
}: PatientCardPorps) {
  const now = useCurrentDate();

  const tasks = patient.taskInstances;
  const organizedTasks = organizeTasks(now, tasks);

  return (
    <article className={styles.card}>
      <div className={styles.cardMain}>

        <section className={styles.overview}>
          <header className={styles.header}>
            <h3 className={styles.room}>
              Room {patient.room}
            </h3>

            <div className={styles.cardActions}>
              <button
                type="button"
                className={styles.addTaskButton}
                aria-label="Add Task"
                title="Add Task"
              >
                <Plus size={18} />
              </button>

              <button
                type="button"
                className={styles.removePatientButton}
                aria-label="Remove patient"
                title="Remove patient"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </header>

          <TaskCategories
            tasks={organizedTasks.remainingTasks}
          />
          <TaskProgress
            identifier={`Room ${patient.room}'s`}
            overdueTaskCount={organizedTasks.overdueTasks.length}
            completedTaskCount={
              tasks.length - organizedTasks.remainingTasks.length
            }
            taskCount={tasks.length}
          />
        </section>

        <section className={styles.currentTasks}>
          <div className={styles.taskHeader}>
            <div className={styles.taskHeading}>
              <Clock3 size={16} />
              <h4>
                {now.toLocaleTimeString([], {
                  hour: "numeric"
                })} Tasks
              </h4>

              <span className={styles.hourCount}>
                ({organizedTasks.currentHourTasks.length})
              </span>
            </div>

            <button
              type="button"
              className={styles.viewAll}
            >
              View All
              <ChevronRight size={15} />
            </button>
          </div>

          <TaskItems
            tasks={organizedTasks.currentHourTasks}
          />
        </section>
      </div>
    </article>
  )
};