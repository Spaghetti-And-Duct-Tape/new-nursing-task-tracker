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

export function getDateTimeLocal(date: Date): string {
  return new Date (
    date.getTime() - date.getTimezoneOffset() * minuteMs
  ).toISOString().slice(0, 16);
};

export function isTimeString(value: string): value is TimeString{  
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function toTimeString(
  value: string
): TimeString | null {  
  const time = value.trim().toLowerCase();

  if (time === "now") {
    return getTimeString(new Date());
  }

  if (time === "hour") {
    const date = new Date();
    date.setMinutes(0, 0, 0);

    return getTimeString(date);
  }
  
  const match = time.match(
    /^(\d{1,2}):(\d{1,2})$|^(\d{1,2})(\d{2})?$/
  );

  if (!match) return null;

  const hours = Number(match[1] ?? match[3]);
  const minutes = Number(match[2] ?? match[4] ?? 0);

  if (hours > 23 || minutes > 59) return null;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}` as TimeString;
};

export function getTimeString(date: Date): TimeString {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}` as TimeString;
};

export function getMaxRepeat(
  times: TimeString[],
  intervalMinutes: number,
  shifStart: Date,
  shiftEnd: Date
): number {
  if (intervalMinutes <= 0) return 1;

  const maxRepeats = times.map(time => {
    const scheduledAt = getScheduledAt(time, shifStart);

    const remainingMinutes = 
      (shiftEnd.getTime() - scheduledAt.getTime()) / minuteMs;

    return Math.max(
      0,
      Math.floor(remainingMinutes / intervalMinutes) + 1
    );
  })

  return Math.max(1, ...maxRepeats);
};