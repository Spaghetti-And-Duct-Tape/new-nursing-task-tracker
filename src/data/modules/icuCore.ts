import type { CareModule } from "../../types/careModule";

export const icuCore: CareModule = {
  id: "icu-core",
  name: "ICU Core",
  description: "Core recurring tasks for an ICU patient.",

  tasks: [{
      id: "vitals",
      name: "Vitals",
      category: "chart",
      workflow: "chart",

      schedule: {
        type: "frequency",
        hours: 1
      }
    },

    {
      id: "intake",
      name: "Intake",
      category: "chart",
      workflow: "complete-and-chart",

      schedule: {
        type: "frequency",
        hours: 1
      }
    },

    {
      id: "output",
      name: "Output",
      category: "chart",
      workflow: "complete-and-chart",

      schedule: {
        type: "frequency",
        hours: 1
      }
    },

    {
      id: "turn-reposition",
      name: "Turn & Reposition",
      category: "chart",
      workflow: "complete-and-chart",

      schedule: {
        type: "frequency",
        hours: 2,
        anchorHour: 0
      }
  },
  {
    id: "shift-screen",
    name: "Shift Screen",
    category: "chart",
    workflow: "complete-and-chart",

    schedule: {
      type: "timed",
      times: ["0800", "2000"]
    }
  }]
};