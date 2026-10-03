import { defaultConfig } from "./data/defaultConfig";
import { icuCore } from "./data/modules/icuCore";
import { defaultDayShift, defaultNightShift } from "./data/shift";
import type { Patient } from "./types/patient";
import { generatePatientTasks } from "./utils/patient/generatePatientTasks";
import { generateModuleTasks } from "./utils/scheduling/generateModuleTasks";
import { getShiftRange } from "./utils/scheduling/getShiftRange";

function App() {

  const currentShift = defaultNightShift;

  const patient: Patient = {
    id: crypto.randomUUID(),
    room: "414",
    moduleIds: [
      "icu-core",
      "sedation",
      "restraints"
    ],
    tasks: [{
      id: "insulin",
      name: "Insulin",
      category: "medication",
      workflow: "complete",

      schedule: {
        type: "frequency",
        hours: 4,
        anchorHour: 0
      }
    }]
  };

  const shift = getShiftRange(
    new Date(),
    currentShift
  );

  const tasks = generatePatientTasks({
    patient,
    config: defaultConfig,
    shiftStart: shift.start,
    shiftEnd: shift.end
  });

  return (
    <main>
      <h1>Nursing Task Tracker</h1>

      <h2>{defaultDayShift.name} Shift</h2>
      <p>Start: {shift.start.toLocaleString()}</p>
      <p>End: {shift.end.toLocaleString()}</p>
      
      <h3>Room: {patient.room}</h3>

      <p>
        Modules: {patient.moduleIds.join(", ")}
      </p>

      <h4>Tasks</h4>
      {tasks.map(task => (
        <div key={task.id}>
          {task.scheduledAt.toLocaleDateString()}
          {" - "}
          {task.scheduledAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })}
          {" - "}
          {task.name}
        </div>
      ))}
    </main>
  );
};

export default App;