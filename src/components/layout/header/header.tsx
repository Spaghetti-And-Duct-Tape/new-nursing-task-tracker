import { useCurrentDate } from "../../../hooks/DateProvider";
import { toMilitaryTimeFormat } from "../../../utils/utils";
import styles from "./header.module.css";

interface HeaderProps {
  name: string;
  start: Date;
  end: Date;
};

export default function Header({
  name,
  start,
  end
}: HeaderProps) {
  const now = useCurrentDate();

  const startTime = toMilitaryTimeFormat(start)
  const endTime = toMilitaryTimeFormat(end);

  const currentDate = now.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "2-digit"
  });

  const currentTime = toMilitaryTimeFormat(now);

  return (
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>
        Nursing Task Tracker
      </h1>

      <p className={styles.subtitle}>
        <span className={styles.shiftName}>
          {name}
        </span>
        <span className={styles.shiftHours}>
          <span className={styles.separator}>
            •
          </span>
          {startTime} - {endTime}
        </span>
        <span className={styles.separator}>
          •
        </span>
        <span className={styles.currentDate}>
          <span>{currentDate} {currentTime}</span>
        </span>
      </p>
    </header>
  );
};