import type { Assignment } from "../../types/assignment";

export function parseAssignment(assignment: string): Assignment {
  const assignmentObject = JSON.parse(assignment);

  return {
    ...assignmentObject,
    shiftStart: new Date(assignmentObject.shiftStart),
    shiftEnd: new Date(assignmentObject.shiftEnd)
  };
};