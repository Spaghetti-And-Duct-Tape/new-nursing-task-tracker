import type { Patient } from "./types/patient";

function App() {

  const patient: Patient = {
    id: crypto.randomUUID(),
    room: "414",
    moduleIds: [
      "icu-core",
      "sedation",
      "restraints"
    ]
  };

  return (
    <main>
      <h1>Nursing Task Tracker</h1>
      
      <p>Room: {patient.room}</p>

      <p>
        Modules: {patient.moduleIds.join(", ")}
      </p>
    </main>
  );
};

export default App;