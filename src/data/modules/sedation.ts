import type { CareModule } from "../../types/careModule";

export const sedation: CareModule = {
  id: "sedation-core",
  name: "Sedation Core",
  description: "Core recurring tasks for a sedated patient.",

  tasks: [{
    id: "rass",
    name: "RASS",
    category: "chart",
    workflow: "complete-and-chart",

    schedule: {
      type: "frequency",
      hours: 1
    }
  }]
}