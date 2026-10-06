export function toDateTimeLocal(date: Date) {
  const offset = date.getTimezoneOffset();
  const offsetMs = offset * 60_000

  return new Date(
    date.getTime() - offsetMs
  )
    .toISOString()
    .slice(0, 16);
};


export function getHour(date: Date) {
  const hour = new Date(date);

  hour.setMinutes(0, 0, 0);

  return hour;
}