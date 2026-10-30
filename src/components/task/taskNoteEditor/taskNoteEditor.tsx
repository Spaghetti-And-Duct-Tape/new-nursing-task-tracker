import { useState, useRef, useEffect } from "react";
import { Check, X } from "lucide-react";
import styles from "./taskNoteEditor.module.css";

type TaskNoteEditorProps = {
  note: string;
  onSave: (note: string) => void;
  onCancel: () => void;
};

export function TaskNoteEditor({
  note,
  onSave,
  onCancel,
}: TaskNoteEditorProps) {
  const [draft, setDraft] = useState(note);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const textarea = textareaRef.current;

      if (!textarea) return;

      textarea.focus();

      const end = textarea.value.length;
      textarea.setSelectionRange(end, end);
      textarea.scrollTop = textarea.scrollHeight;
    });
    
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={styles.noteEditor}>
      <textarea
        ref={textareaRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onCancel();
        }}
        placeholder="Add a note..."
        rows={1}
      />

      <div className={styles.actions}>
        <button type="button" onClick={onCancel}>
          <X size={14} />
          Cancel
        </button>

        <button
          type="button"
          className={styles.saveButton}
          onClick={() => onSave(draft)}
        >
          <Check size={14} />
          Save
        </button>
      </div>
    </div>
  );
}