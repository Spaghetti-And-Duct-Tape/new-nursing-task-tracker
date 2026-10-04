import type { CareModule } from "../../types/careModule";

export const icuCore: CareModule = {
  id: "icu-core",
  name: "ICU Core",
  description: "Core recurring tasks for an ICU patient.",

  tasks: [{
      id: "temperature",
      name: "Temperature",
      category: "chart",
      workflow: "complete-and-chart",

      schedule: {
        type: "frequency",
        hours: 4,
      }
    }, {
      id: "output",
      name: "Output",
      category: "chart",
      workflow: "complete-and-chart",

      schedule: {
        type: "frequency",
        hours: 1
      }
    }]
};