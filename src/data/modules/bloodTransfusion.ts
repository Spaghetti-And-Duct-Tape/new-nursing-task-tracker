import type { CareModule } from "../../types/careModule";

const bloodTransfusion: CareModule = {
  id: "blood-transfusion",
  name: "Blood Transfusion",
  description: "Vital sign monitoring during a blood transfusion.",

  source: "system",
  persistent: false,

  tasks: [{
      id: "blood-transfusion-initial-vitals",
      name: "Transfusion Vitals - Initial",
      category: "chart",
      workflow: "complete-and-chart",

      schedule: {
        times: ["now"],
        offset: 0,
        interval: 15,
        repeat: 2
      }
    }, {
      id: "blood-transfusion-hourly-vitals",
      name: "Transfusion Vitals - Hourly",
      category: "chart",
      workflow: "complete-and-chart",

      schedule: {
        times: ["hour"],
        offset: 60,
        interval: 60,
        repeat: 4
      }
    }]
};

export default bloodTransfusion;