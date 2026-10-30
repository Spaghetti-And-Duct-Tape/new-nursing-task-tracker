import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import styles from "./taskOptionsMenu.module.css";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";

type Props = {
  onEditNote: () => void;
  onDelete: () => void;
};

export default function TaskOptionsMenu({
  onDelete
}: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={styles.trigger}
        aria-label="Task Options"
      >
        <Ellipsis size={18} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={styles.content}
          side="bottom"
          align="end"
          sideOffset={5}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenu.Item
            className={styles.item}
          >
            <Pencil size={16} />
            Edit Task
          </DropdownMenu.Item>

          <DropdownMenu.Separator className={styles.separator} />

          <DropdownMenu.Item
            className={`${styles.item} ${styles.danger}`}
            onSelect={onDelete}
          >
            <Trash2 size={16} />
            Delete Task
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};