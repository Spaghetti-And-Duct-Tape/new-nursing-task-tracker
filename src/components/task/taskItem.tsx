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
  handleTaskClick: () => void;
};

export function TaskItem({
  task,
  handleTaskClick
}: TaskItemProps) {
  return (
    <button 
      onPointerDown={handleTaskClick}
      style={{
        margin: "10px 0"
      }}
    >
      {task.scheduledAt.toLocaleDateString()}
      {task.scheduledAt.toTimeString()}
      
      {" - "}
      <span>
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
      </span>
      {task.note && (
        <p>{task.note}</p>
      )}
    </button>
  );
};