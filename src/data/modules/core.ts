import type { CareModule } from "../../types/careModule";

const core: CareModule = {
  id: "core",
  name: "Core",
  description: "Essential routine patient care and monitoring tasks.",

  source: "system",
  persistent: true,

  tasks: [{
      id: "core-temperature",
      name: "Temperature",
      category: "chart",
      workflow: "complete-and-chart",

      schedule: {
        times: ["08:00", "20:00"],
        offset: 0,
        interval: 240,
        repeat: 3
      }
    }, {
      id: "core-output",
      name: "Output",
      category: "chart",
      workflow: "complete-and-chart",

      schedule: {
        times: ["07:00", "19:00"],
        offset: 0,
        interval: 60,
        repeat: 12
      }
    }]
};

export default core;