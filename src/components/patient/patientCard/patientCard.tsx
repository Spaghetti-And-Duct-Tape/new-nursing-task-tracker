import { ArrowUpRight, Clock, Layers, Plus, Trash2 } from "lucide-react";
import type { Patient } from "../../../types/patient";

import styles from "./patientCard.module.css";
import TaskProgress from "../../task/taskProgress/taskProgress";
import { useCurrentDate } from "../../../hooks/DateProvider";
import { filterTaskCategories, isTaskFinished, organizeTasks } from "../../../utils/tasks/organizeTasks";
import TaskCategories from "../../task/taskCategories/taskCategories";
import { useState } from "react";
import type { TaskCategory } from "../../../types/task";
import { useAssignment } from "../../../hooks/AssignmentProvider";
import AddTaskModal from "../../modals/taskModals/addTaskModal";
import ShiftTimeLine from "../../task/shiftTimeline/shiftTimeline";
import TaskItems from "../../task/taskItems/taskItems";

interface PatientCardProps {
  patient: Patient;
  shiftStart: Date;
  shiftEnd: Date;
}

export default function PatientCard({
  patient,
  shiftStart,
  shiftEnd
}: PatientCardProps) {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const now = useCurrentDate();
  const {removePatient} = useAssignment();
  const tasks = patient.taskInstances;

  const [selectedHour, setSeletedHour] = useState<number | "all">(
    now.getHours()
  );
  const [activeCategory, setActiveCategory] = useState<Exclude<TaskCategory, "chart"> | "all">("all");

  const visibleTasks = selectedHour === "all"
    ? tasks
    : tasks.filter(task => 
      new Date(task.scheduledAt).getHours() === selectedHour
    );

  const categorizedTasks =
    activeCategory === "all" ?
      visibleTasks :
      filterTaskCategories(visibleTasks, activeCategory);

  const displayedTasks = selectedHour === "all" ?
    categorizedTasks :
    [...categorizedTasks].sort((a, b) => {
      return Number(isTaskFinished(a)) - Number(isTaskFinished(b));
    });

  const unfinishedTasks = visibleTasks.filter(
    task => !isTaskFinished(task)
  );


  const organizedTasks = organizeTasks(now, tasks);


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
              onClick={() => 
                removePatient(patient.id)
              }
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

            <div className={styles.taskActions}>
              <button
                type="button"
                className={styles.nowButton}
                onClick={() => setSeletedHour(now.getHours())}
              >
                <Clock size={18} />
                Now
              </button>
              <button
                type="button"
                className={styles.addTaskButton}
                aria-label="Add task"
                onClick={() => setIsTaskFormOpen(true)}
              >
                <Plus size={18} /> Add
              </button>
            </div>
          </div>

          <ShiftTimeLine
            tasks={tasks}
            shiftStart={shiftStart}
            shiftEnd={shiftEnd}
            selectedHour={selectedHour}
            onSelectedHour={setSeletedHour}
          />

          <TaskItems
            category={activeCategory}
            selectedHour={selectedHour}
            tasks={displayedTasks}
          />
        </section>
      </div>

      <AddTaskModal
        patient={patient}
        open={isTaskFormOpen}
        onOpenChange={setIsTaskFormOpen}
      />
    </article>
  )
};