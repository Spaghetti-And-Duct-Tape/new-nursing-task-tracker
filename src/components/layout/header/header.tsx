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
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit"
  };

  const startTime = start.toLocaleTimeString([], timeOptions)
  const endTime = end.toLocaleTimeString([], timeOptions);

  const date = start.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "2-digit"
  });

  return (
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>
        Nursing Task Tracker
      </h1>

      <p className={styles.subtitle}>
        <span className={styles.shiftName}>
          {name}
        </span>
        <span className={styles.separator}>
          •
        </span>
        <span className={styles.shiftHours}>
          {startTime} - {endTime}
        </span>

        <span className={styles.shiftDate}>
          <span className={styles.separator}>
            •
          </span>
          <span>{date}</span>
        </span>
      </p>
    </header>
  );
};