import type { TaskInstance } from "../../types/task";

export function advanceTaskStatus(
  task: TaskInstance
): TaskInstance {

  const now = new Date();

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
        completed: true,
        completedAt: now,
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
      };

      return {
        ...task,
        charted: true,
        chartedAt: now
      };
  };
};