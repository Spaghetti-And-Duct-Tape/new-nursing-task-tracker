import type { CareModule } from "../../types/careModule";

const newAdmit: CareModule = {
  id: "new-admit",
  name: "New Admission",
  description: "Initial patient admission tasks.",

  source: "system",
  persistent: false,

  tasks: [{
      id: "new-admit-notification",
      name: "Notification to Admitting",
      category: "chart",
      workflow: "chart",

      schedule: {
        times: ["now"],
        offset: 0,
        interval: 0,
        repeat: 1
      }
    },
    {
      id: "new-admit-provider",
      name: "Notify Provider",
      category: "chart",
      workflow: "chart",

      schedule: {
        times: ["now"],
        offset: 0,
        interval: 0,
        repeat: 1
      }
    },
    {
      id: "new-admit-monitor",
      name: "Associate Patient Monitor",
      category: "chart",
      workflow: "chart",

      schedule: {
        times: ["now"],
        offset: 0,
        interval: 0,
        repeat: 1
      }
    },
    {
      id: "new-admit-vitals",
      name: "Temp, VS, Height, Weight, and Glucose",
      category: "chart",
      workflow: "complete-and-chart",

      schedule: {
        times: ["now"],
        offset: 0,
        interval: 0,
        repeat: 1
      }
    },
    {
      id: "new-admit-skin",
      name: "CHG, 2 RN Skin Check",
      category: "chart",
      workflow: "complete-and-chart",

      schedule: {
        times: ["now"],
        offset: 0,
        interval: 0,
        repeat: 1
      }
    },
    {
      id: "new-admit-history",
      name: "AdHoc - Adult Admission History",
      category: "chart",
      workflow: "chart",

      schedule: {
        times: ["now"],
        offset: 0,
        interval: 0,
        repeat: 1
      }
    },
    {
      id: "new-admit-orders",
      name: "AdHoc - Order Entry",
      category: "chart",
      workflow: "chart",

      schedule: {
        times: ["now"],
        offset: 0,
        interval: 0,
        repeat: 1
      }
    },
    {
      id: "new-admit-shift-screen",
      name: "AdHoc - Shift Screen",
      category: "chart",
      workflow: "chart",

      schedule: {
        times: ["now"],
        offset: 0,
        interval: 0,
        repeat: 1
      }
    },
    {
      id: "new-admit-belongings",
      name: "AdHoc - Valuables and Belongings",
      category: "chart",
      workflow: "chart",

      schedule: {
        times: ["now"],
        offset: 0,
        interval: 0,
        repeat: 1
      }
    },
    {
      id: "new-admit-swallow",
      name: "AdHoc - ED - Swallow Screen for Dysphagia",
      category: "chart",
      workflow: "chart",

      schedule: {
        times: ["now"],
        offset: 0,
        interval: 0,
        repeat: 1
      }
    },
    {
      id: "new-admit-pawss",
      name: "AdHoc - PAWSS (if ETOH)",
      category: "chart",
      workflow: "chart",

      schedule: {
        times: ["now"],
        offset: 0,
        interval: 0,
        repeat: 1
      }
    },
    {
      id: "new-admit-home-meds",
      name: "Home Meds and Patient Pharm",
      category: "chart",
      workflow: "chart",

      schedule: {
        times: ["now"],
        offset: 0,
        interval: 0,
        repeat: 1
      }
    },
    {
      id: "new-admit-education",
      name: "Patient Education",
      category: "chart",
      workflow: "chart",

      schedule: {
        times: ["now"],
        offset: 0,
        interval: 0,
        repeat: 1
      }
    },
    {
      id: "new-admit-care-plans",
      name: "Care Plans",
      category: "chart",
      workflow: "chart",

      schedule: {
        times: ["now"],
        offset: 0,
        interval: 0,
        repeat: 1
      }
    },
    {
      id: "new-admit-family",
      name: "Inform Patient/Family: Room, Unit, and PIN",
      category: "chart",
      workflow: "complete",

      schedule: {
        times: ["now"],
        offset: 0,
        interval: 0,
        repeat: 1
      }
    }]
};

export default newAdmit;