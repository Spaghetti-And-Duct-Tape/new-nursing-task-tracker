import type { CareModule } from "../../types/careModule";

const taysCore: CareModule = {
  id: "taysCore",
  name: "Tay Tay's Core",
  description: "Core recurring tasks for Tay Tay's Patients.",

  source: "system",

  persistent: true,

  tasks: [{
      id: "tays-bmat",
      name: "BMAT",
      category: "chart",
      workflow: "chart",

      schedule: {
        times: ["06:00", "18:00"],
        offset: 0,
        interval: 240,
        repeat: 1
      }
    }, {
      id: "tays-delirium",
      name: "Delirium",
      category: "chart",
      workflow: "chart",

      schedule: {
        times: ["06:00", "18:00"],
        offset: 0,
        interval: 240,
        repeat: 1
      }
    }, {
      id: "tays-oral-care",
      name: "Oral Care",
      category: "chart",
      workflow: "chart",

      schedule: {
        times: ["06:00", "18:00"],
        offset: 0,
        interval: 240,
        repeat: 1
      }
    }, {
      id: "tays-is",
      name: "IS",
      category: "chart",
      workflow: "chart",

      schedule: {
        times: ["06:00", "18:00"],
        offset: 0,
        interval: 240,
        repeat: 1
      }
    }, {
      id: "tays-ambulation",
      name: "Ambulation",
      category: "chart",
      workflow: "chart",

      schedule: {
        times: ["06:00", "18:00"],
        offset: 0,
        interval: 240,
        repeat: 1
      }
    }, {
      id: "tays-i-o",
      name: "I + O",
      category: "chart",
      workflow: "chart",

      schedule: {
        times: ["06:00", "18:00"],
        offset: 0,
        interval: 240,
        repeat: 1
      }
    },]
};

export default taysCore;