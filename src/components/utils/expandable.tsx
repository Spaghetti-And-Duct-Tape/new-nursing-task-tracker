import { useState } from "react";
import styles from "./expandable.module.css";
import { ChevronDown, type LucideIcon } from "lucide-react";

type Props = {
  title: string;
  children: React.ReactNode;
  icon?: LucideIcon;
};

export default function Expandable({
  title, 
  icon: Icon,
  children
}: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className={styles.expandableSection}>
      <button
        type="button"
        className={styles.expandableToggle}
        onClick={() => setExpanded(prev => !prev)}
        aria-expanded={expanded}
      >
        <span>
          {Icon && <Icon size={16} />}
          {title}
        </span>

        <ChevronDown 
          size={16}
          className={expanded ? styles.chevronOpen : ""} 
        />
      </button>

      {expanded && (
        <div className={styles.expandableContent}>
          {children}
        </div>
      )}
    </section>
  )
};