import type { CSSProperties } from "react";
import type { TaskInstance } from "../../types/task";

function getTaskDecoration(
  task: TaskInstance
): CSSProperties | undefined {

  if (!task.completed) return undefined;

  return {
    textDecoration: "line-through",
    textDecorationStyle: task.charted
      ? "double"
      : undefined
  };
};


interface TaskItemProps {
  task: TaskInstance;
  onClick: () => void;
};

export function TaskItem({
  task,
  onClick
}: TaskItemProps) {
  return (
    <button onClick={onClick}>
      {task.scheduledAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })}

      {" - "}

      <span
        style={getTaskDecoration(task)}
      >
        {task.name}
      </span>
      
      {" - "}

      {task.completed 
        ?  "✓" 
        : "○"
      }
      {task.charted && "✓"}
    </button>
  );
};