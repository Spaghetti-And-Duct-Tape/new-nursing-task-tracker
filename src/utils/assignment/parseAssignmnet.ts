import type { Assignment } from "../../types/assignment";

export function parseAssignment(saved: string): Assignment {
  const parsed = JSON.parse(saved) as Assignment;

  return {
    ...parsed,
    shiftStart: new Date(parsed.shiftStart),
    shiftEnd: new Date(parsed.shiftEnd),
    patients: parsed.patients.map(patient => ({
      ...patient,
      taskInstances: patient.taskInstances.map(task => ({
        ...task,
        scheduledAt: new Date(task.scheduledAt),
        completedAt: task.completedAt
          ? new Date(task.completedAt)
          : undefined,
        chartedAt: task.chartedAt
          ? new Date(task.chartedAt)
          : undefined
      }))
    }))
  };
}