import type { TaskInstance } from "../types/task";
import type { TimeString } from "../types/time";

export const minuteMs = 60_000;

export function toMilitaryTimeFormat(date: Date) {
  return date.toLocaleTimeString([], {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit"
  });
};

export function addOffsetMin(
  date: Date,
  offset: number
): Date {

  return new Date(
    date.getTime() + offset * minuteMs
  );
};

export function getScheduledAt(
  time: TimeString | "now" | "hour",
  shiftStart: Date
): Date {
  if (time === "now") {
    return new Date();
  };

  if (time === "hour") {
    const date = new Date();

    date.setMinutes(0, 0, 0);

    return date;
  };

  const [hours, minutes] = time
    .split(":")
    .map(Number);

  const scheduledAt = new Date(shiftStart);

  scheduledAt.setHours(
    hours,
    minutes,
    0,
    0
  );

  if (scheduledAt < shiftStart) {
    scheduledAt.setDate(
      scheduledAt.getDate() + 1
    );
  }

  return scheduledAt;
};

export function sortByTime(
  tasks: TaskInstance[]
) {
  return tasks
    .sort((a, b) =>
      a.scheduledAt.getTime() -
      b.scheduledAt.getTime()
  );
};