import type { CareModule } from "../../types/careModule";
import { getFutureStringTime } from "../../utils/utils";

export const bloodTransfusion: CareModule = {
  id: "blood-transfuion",
  name: "Blood Transfusion",
  description: "Core recurring tasks for a patient receiving a blood transfusion.",

  persistent: false,

  tasks: [{
      id: "temperature",
      name: "Temperature - Blood Transfusion 15 minutes",
      category: "chart",
      workflow: "complete-and-chart",

      schedule: {
        type: "timed",
        times: [getFutureStringTime(
          new Date(),
          15
        )],
      }
    }, {
      id: "temperature",
      name: "Temperature - Blood Transfusion Hourly",
      category: "chart",
      workflow: "complete-and-chart",

      schedule: {
        type: "frequency",
        hours: 1
      }
    }]
};