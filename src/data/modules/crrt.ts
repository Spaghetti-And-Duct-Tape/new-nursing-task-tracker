import type { CareModule } from "../../types/careModule";

const crrt: CareModule = {
  id: "crrt",
  name: "CRRT",
  description: "Tasks for patients on CRRT.",
  persistent: true,

  tasks: [
    {
      id: "crrt-labs",
      name: "CRRT Labs",
      category: "chart",
      workflow: "complete",

      schedule: {
        times: ["10:00", "22:00"],
        offset: 0,
        interval: 360,
        repeat: 2
      }
    }
  ]
};

export default crrt;