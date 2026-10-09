import type { CareModule } from "../../types/careModule";

const bloodTransfusion: CareModule = {
  id: "blood-transfuion",
  name: "Blood Transfusion",
  description: "Core recurring tasks for a patient receiving a blood transfusion.",

  persistent: false,

  tasks: [{
      id: "blood-transfusion-temperature",
      name: "Blood Transfusion - Temperature and vitals",
      category: "chart",
      workflow: "complete-and-chart",

      schedule: {
        times: ["now"],
        offset: 0,
        interval: 15,
        repeat: 2
      }
    }, {
      id: "blood-transfusion-temperature",
      name: "Blood Transfusion - Temperature and vitals",
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