import { Check, CheckCheck, Circle, CircleDot, CircleDotDashed, StickyNote } from "lucide-react";
import type { TaskCategory, TaskInstance } from "../../../types/task";
import styles from "./taskItems.module.css";
import { toMilitaryTimeFormat } from "../../../utils/utils";
import { isOverdue, isTaskFinished } from "../../../utils/tasks/organizeTasks";
import { useCurrentDate } from "../../../hooks/DateProvider";
import { useAssignment } from "../../../hooks/AssignmentProvider";
import { advanceTaskStatus } from "../../../utils/tasks/advanceTaskStatus";
import TaskOptionsMenu from "../taskOptionsMenu/taskOptionsMenu";
import { useState } from "react";
import { TaskNoteEditor } from "../taskNoteEditor/taskNoteEditor";

interface TaskItemsProps {
  tasks: TaskInstance[];
  category: Exclude<TaskCategory, "chart"> | "all",
  selectedHour: number | "all"
};

export default function TaskItems({
  tasks,
  category,
  selectedHour
}: TaskItemsProps) {
  const categoryLabel = 
    category === "all" ? "" : category

  const timeLabel = 
    selectedHour === "all" ? 
    "scheduled this shift" : 
    "scheduled this hour";

  return (
    <div className={styles.taskList}>
      {tasks.length === 0 ? (
        <div className={styles.emptyTasks}>
          No {categoryLabel} tasks {timeLabel}.
        </div>
      ) : (
        tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
          />
        ))
      )}
    </div>
  )
};


function status(task: TaskInstance) {
  const {workflow, completed, charted} = task;

  const isComplete = workflow === "complete-and-chart" ?
    completed && charted :
    completed || charted;

  if (isComplete) return "complete";

  if (completed || charted) return "inProgress";

  return "pending"
};

function TaskItem({
  task,
}: {
  task: TaskInstance,
}) {
  const {updateTask, deleteTask} = useAssignment();

  const now = useCurrentDate();
  const currentStatus = status(task);
  const overdue = !isTaskFinished(task) && isOverdue(task, now);

  const [editingNote, setEditingNote] = useState(false);

  return (
    <div className={styles.taskItem}>
      <div className={styles.taskRow}>
        <button
          type="button"
          className={styles.buttonStatus}
          aria-label={`Progress ${task.name}`}
          onClick={() => 
            updateTask(
              advanceTaskStatus(task)
          )}
        >
          <span
            className={`${styles.taskStatus} ${styles[currentStatus]} ${overdue ? styles.overdue : ""}`}
          >
            <span className={styles.statusIcon}>
              <TaskStatusIcon task={task} />
            </span>
          </span>

          <span className={styles.taskDetails}>
            <span className={styles.taskNameRow}>
              <span className={`${styles.taskName} ${styles[task.category]}`}>
                {currentStatus=== "complete" ?
                  <s>{task.name}</s> :
                  task.name
                }
              </span>
              {(task.charted && task.chartedAt && (
                <span className={styles.timeStamp}>
                  Charted {toMilitaryTimeFormat(new Date(task.chartedAt))}
                </span>
              )) || (task.completed && task.completedAt && (
                <span className={styles.timeStamp}>
                  Completed {toMilitaryTimeFormat(new Date(task.completedAt))}
                </span>
              ))}
            </span>
            <span className={styles.taskMeta}>
              <span className={styles.taskTime}>
                {toMilitaryTimeFormat(new Date(task.scheduledAt))}
              </span>

              {task.note?.trim() && (
                <>
                  <span className={styles.taskSeparator}>·</span>

                  <span className={styles.taskNote}>
                    {task.note}
                  </span>
                </>
              )}
            </span>
          </span>
        </button>
        <button
          type="button"
          className={styles.noteButton}
          onClick={() => setEditingNote(prev => !prev)}
          aria-label={`Edit note for ${task.name}`}
          >
            <StickyNote size={16} />
          </button>

        <TaskOptionsMenu
          onEditNote={() => setEditingNote(true)} 
          onDelete={() => deleteTask(task)}
        />

      </div>

      {editingNote && (
        <TaskNoteEditor
          name={task.name}
          note={task.note ?? ""}
          onSave={(note) => {
            updateTask({...task, note});
            setEditingNote(false)
          }} 
          onCancel={() => setEditingNote(false)}
        />
      )}
    </div>
  )
};


function TaskStatusIcon({
  task
} : {
  task: TaskInstance;
}) {
  const partiallyComplete =
    task.workflow === "complete-and-chart" &&
    task.completed &&
    !task.charted;
    
  if (partiallyComplete) return <Check size={18} />;
    
  if (task.completed || task.charted) return <CheckCheck size={18} />;

  switch (task.workflow) {
    case "complete":
      return <Circle size={18} />;
    case "chart":
      return <CircleDot size={18} />;
    case "complete-and-chart":
      return <CircleDotDashed size={18} />;
  };
}