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