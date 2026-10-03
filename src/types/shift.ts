export interface ShiftTime {
  hour: number;
  minute: number;
}

export interface Shift {
  id: string;
  name: string;
  start: ShiftTime;
  end: ShiftTime;
}