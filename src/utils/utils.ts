import type { TimeString } from "../types/time";

export function toDateTimeLocal(date: Date) {
  const offset = date.getTimezoneOffset();
  const offsetMs = offset * 60_000

  return new Date(
    date.getTime() - offsetMs
  )
    .toISOString()
    .slice(0, 16);
};

export function frequencyInMilliseconds(frequency: number): number {
  return frequency * 3_600_000;
};

export function getHour(date: Date) {
  const hour = new Date(date);

  hour.setMinutes(0, 0, 0);

  return hour;
};

export function getStringTime(time: Date): string {
  return [
    time.getHours().toString().padStart(2, "0"),
    time.getMinutes().toString().padStart(2, "0")
  ].join(":");
};

export function getFutureStringTime(
  time: Date,
  offset: number
): string {
  const minuteMS = 60_000;

  return getStringTime(new Date(
    time.getTime() + offset * minuteMS
  ));
};

export function addOffsetMin(
  time: Date,
  offset: number
): Date {
  const minuteMS = 60_000;

  return new Date(
    time.getTime() + offset * minuteMS
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