import type { TaskCategory, TaskInstance } from "../../types/task";
import { addOffsetMin } from "../utils";

export function organizeTasks(
  date: Date,
  tasks: TaskInstance[]
) {
  const remainingTasks = tasks.filter(
    task => !isTaskFinished(task)
  );

  return {
    remainingTasks,
    overdueTasks: remainingTasks.filter(
      task => isOverdue(task, date)
    ),
    activeTasks: currentHourTasks(tasks, date),
  };
};

export function isOverdue(
  task: TaskInstance, 
  currentDate: Date
): boolean {
  const date = new Date(task.scheduledAt);
  const gracePeriod = addOffsetMin(date, 60);
    
  return gracePeriod.getTime() < currentDate.getTime()
};

export function isTaskFinished(task: TaskInstance): boolean {
  switch (task.workflow) {
    case "complete":
      return task.completed;

    case "chart":
      return task.charted;

    case "complete-and-chart":
      return task.completed && task.charted;
  }
}

export function filterTaskCategories(
  tasks: TaskInstance[],
  category: TaskCategory
) {
  return tasks.filter(
    task => task.category === category
  )
};

export function currentHourTasks(
  tasks: TaskInstance[],
  date: Date
): TaskInstance[] {
  return tasks.filter(task => {
    const scheduled = new Date(task.scheduledAt);

    const sameHour =
      scheduled.getFullYear() === date.getFullYear() &&
      scheduled.getMonth() === date.getMonth() &&
      scheduled.getDate() === date.getDate() &&
      scheduled.getHours() === date.getHours();

    return sameHour;
  });
};