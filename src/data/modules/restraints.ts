import type { CareModule } from "../../types/careModule";

export const restraints: CareModule = {
  id: "restraints",
  name: "Restraints",
  description: "Assessment and documentation tasks for restraints.",

  tasks: [{
      id: "restraint-assessment",
      name: "Restraint Assessment",
      category: "chart",
      workflow: "complete-and-chart",

      schedule: {
        type: "frequency",
        hours: 2
      }
    },

    {
      id: "restraint-renewal",
      name: "Renew Restraints",
      category: "chart",
      workflow: "chart",

      schedule: {
        type: "timed",
        times: ["0000", "1200"]
      }
  }]
};