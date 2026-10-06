import type { CareModule } from "../../types/careModule";

export const taysCore: CareModule = {
  id: "taysCore",
  name: "Taylor's Core",
  description: "Core recurring tasks for Taylor's Patients.",

  persistent: true,

  tasks: [{
      id: "bmat",
      name: "BMAT",
      category: "chart",
      workflow: "chart",

      schedule: {
        type: "timed",
        times: ["0600"],
      }
    }, {
      id: "delirium",
      name: "Delirium",
      category: "chart",
      workflow: "chart",

      schedule: {
        type: "timed",
        times: ["0600"],
      }
    }, {
      id: "oral-care",
      name: "Oral Care",
      category: "chart",
      workflow: "chart",

      schedule: {
        type: "timed",
        times: ["0600"],
      }
    }, {
      id: "is",
      name: "IS",
      category: "chart",
      workflow: "chart",

      schedule: {
        type: "timed",
        times: ["0600"],
      }
    }, {
      id: "ambulation",
      name: "Ambulation",
      category: "chart",
      workflow: "chart",

      schedule: {
        type: "timed",
        times: ["0600"],
      }
    }, {
      id: "i-o",
      name: "I + O",
      category: "chart",
      workflow: "chart",

      schedule: {
        type: "timed",
        times: ["0600"],
      }
    },]
};