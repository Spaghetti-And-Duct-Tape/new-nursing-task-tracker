import type { CareModule } from "../../types/careModule";

const postOpVitals: CareModule = {
  id: "post-op-vitals",
  name: "Post-Op Vitals",
  description: "Routine post-operative vital sign monitoring.",

  source: "system",
  persistent: false,

  tasks: [{
      id: "post-op-vitals-q15",
      name: "Post-Op Vitals Q15",
      category: "chart",
      workflow: "complete-and-chart",

      schedule: {
        times: ["now"],
        offset: 0,
        interval: 15,
        repeat: 5
      }
    },
    {
      id: "post-op-vitals-q30",
      name: "Post-Op Vitals Q30",
      category: "chart",
      workflow: "complete-and-chart",

      schedule: {
        times: ["now"],
        offset: 90,
        interval: 30,
        repeat: 2
      }
    },
    {
      id: "post-op-vitals-q1",
      name: "Post-Op Vitals Q1H",
      category: "chart",
      workflow: "complete-and-chart",

      schedule: {
        times: ["hour"],
        offset: 180,
        interval: 60,
        repeat: 4
      }
    }]
};

export default postOpVitals;