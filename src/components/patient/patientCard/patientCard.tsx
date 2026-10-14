import { ArrowUpRight, Layers, Plus, Trash2 } from "lucide-react";
import type { Patient } from "../../../types/patient";

import styles from "./patientCard.module.css";
import TaskProgress from "../../task/taskProgress/taskProgress";
import { useCurrentDate } from "../../../hooks/DateProvider";
import { filterTaskCategories, isTaskFinished, organizeTasks } from "../../../utils/tasks/organizeTasks";
import TaskCategories from "../../task/taskCategories/taskCategories";
import { useState } from "react";
import TaskItems from "../../task/taskItems/taskItems";
import type { TaskCategory, TaskInstance } from "../../../types/task";

interface PatientCardProps {
  patient: Patient;
  updatePatient: (
    id: string, 
    updater: (patient: Patient) => Patient | null
  ) => void;
}

export default function PatientCard({
  patient,
  updatePatient
}: PatientCardProps) {
  const now = useCurrentDate();
  const tasks = patient.taskInstances
  const organizedTasks = organizeTasks(now, tasks);

  const [timeFilter, setTimeFilter] = useState<"hour" | "overdue" | "all">("hour");
  const [activeCategory, setActiveCategory] = useState<Exclude<TaskCategory, "chart"> | "all">("all");

  const timedTasks = 
    timeFilter === "hour" ?
      organizedTasks.activeTasks :
      timeFilter === "overdue" ?
        organizedTasks.overdueTasks :
        tasks;

  
  const categorizedTasks = 
    activeCategory === "all" ?
      timedTasks :
      filterTaskCategories(timedTasks, activeCategory);

  const unfinishedTasks = timedTasks.filter(
    task => !isTaskFinished(task)
  );

  function updateTasks(
    updater: (tasks: TaskInstance[]) => TaskInstance[]
  ) {
    updatePatient(patient.id, currentPatient => ({
      ...currentPatient,
      taskInstances: updater(currentPatient.taskInstances)
    }));
  };

  return (
    <article
      className={styles.card}
    >
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <button
            type="button"
            className={styles.room}
          >
            Room {patient.room}
            <ArrowUpRight size={16} />
          </button>
          <div className={styles.headerActions}>
            <button 
              type="button"
              className={styles.moduleButton}
            >
              <Layers size={16} />
              <span>Modules</span>
            </button>

            <button
              type="button"
              className={styles.removeButton}
              aria-label={`Remove patient from room ${patient.room}`}
              onClick={() => updatePatient(patient.id, () => null)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <TaskProgress
          identifier={`Room ${patient.room}'s`}
          overdueTaskCount={organizedTasks.overdueTasks.length}
          completedTaskCount={
            tasks.length - organizedTasks.remainingTasks.length
          }
          taskCount={tasks.length}
        />
      </header>
      <div className={styles.cardMain}>
        <TaskCategories
          tasks={unfinishedTasks} 
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      
        <section className={styles.taskViewer}>
          <div className={styles.taskHeader}>
            <h4 className={styles.taskTitle}>Tasks</h4>

            <button
              type="button"
              className={styles.addTaskButton}
              aria-label="Add task"
            >
              <Plus size={18} /> Add
            </button>
          </div>

          <div className={styles.timeFilter}>
            <button
              type="button"
              className={timeFilter === "hour" ? styles.activeTimeFilter : ""}
              onClick={() => setTimeFilter("hour")}
            >
              This Hour
            </button>
            <button
              type="button"
              className={timeFilter === "overdue" ? styles.activeTimeFilter : ""}
              onClick={() => setTimeFilter("overdue")}
            >
              Overdue 
            </button>
            <button
              type="button"
              className={timeFilter === "all" ? styles.activeTimeFilter : ""}
              onClick={() => setTimeFilter("all")}
            >
              All hours
            </button>
          </div>

          <TaskItems
            tasks={categorizedTasks}
            updateTasks={updateTasks}
          />
        </section>
      </div>
    </article>
  )
};