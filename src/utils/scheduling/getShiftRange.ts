import type { Shift } from "../../types/shift";

interface ShiftRange {
  start: Date;
  end: Date;
};

export function getShiftRange(
  date: Date,
  shift: Shift
): ShiftRange {
  
  //Gets the current date
  const start = new Date(date);

  //Sets the start of the shift to the preset start time
  start.setHours(
    shift.start.hour,
    shift.start.minute,
    0,
    0
  );

  const end = new Date(date);

  end.setHours(
    shift.end.hour,
    shift.end.minute,
    0,
    0
  );

  //Using military time if end is small than start it must 
  //be a new day
  if (end <= start) {
    end.setDate(end.getDate() + 1);
  };

  return {
    start, 
    end
  }

};