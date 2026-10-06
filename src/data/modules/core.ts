import type { CareModule } from "../../types/careModule";

export const core: CareModule = {
  id: "core",
  name: "Core",
  description: "Core recurring tasks for a patient.",

  persistent: true,

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