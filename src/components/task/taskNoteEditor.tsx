import { useState } from "react";
import type { TaskInstance } from "../../types/task";

interface TaskNoteEditorProps {
  task: TaskInstance;
  onNoteChange: (
    task: TaskInstance,
    note: string
  ) => void;
};

export function TaskNoteEditor({
  task,
  onNoteChange
}: TaskNoteEditorProps) {
  const [note, setNote] = useState(task.note ?? "");

  function handleBlur() {
    if (note === (task.note ?? "" )) return;

    onNoteChange(task, note)
  };

  return (
    <textarea
      value={note}
      onChange={(e) => 
        setNote(e.target.value)
      }
      onBlur={handleBlur}
      style={{
        margin: "-10px 0"
      }}
    />
  );
};