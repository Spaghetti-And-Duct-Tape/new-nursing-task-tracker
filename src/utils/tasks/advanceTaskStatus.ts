import type { TaskInstance } from "../../types/task";

export function advanceTaskStatus(
  task: TaskInstance
): TaskInstance {

  const now = new Date();

  // Reset if the task has reached its final stage
  if (
    (task.workflow === "complete" && task.completed) ||
    (task.workflow === "chart" && task.charted) ||
    (task.workflow === "complete-and-chart" && task.completed && task.charted)
  ) {
    return {
      ...task,
      completed: false,
      completedAt: undefined,
      charted: false,
      chartedAt: undefined
    };
  }

  switch (task.workflow) {
    case "complete":
      return {
        ...task,
        completed: true,
        completedAt: now
      };

    case "chart":
      return {
        ...task,
        charted: true,
        chartedAt: now
      };

    case "complete-and-chart":
      if (!task.completed) {
        return {
          ...task,
          completed: true,
          completedAt: now
        };
      }

      return {
        ...task,
        charted: true,
        chartedAt: now
      };
  }
}