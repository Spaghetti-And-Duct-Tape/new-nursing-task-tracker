import { useState } from "react";
import type { Patient } from "../../types/patient";
import { defaultConfig } from "../../data/defaultConfig";

interface AddPatientFormProps {
  onAddPatient: (patient: Patient) => void;
}

export function AddPatientForm({
  onAddPatient
}: AddPatientFormProps) {
  const [room, setRoom] = useState<string>("");

  function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const trimmedRoom = room.trim();
    
    if (!trimmedRoom) return;

    const patient: Patient = {
      id: crypto.randomUUID(),
      room: trimmedRoom,

      moduleIds: defaultConfig.modules.map(
        module => module.id
      ),
      
      taskDefinitions: [],
      taskInstances: []
    };
    
    onAddPatient(patient);

    setRoom("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Patient</h2>

      <label>
        <p>Room</p>

        <input
          placeholder="Patient Room"
          type="number"
          value={room}
          onChange={e => 
            setRoom(e.target.value)
          }
        />
      </label>

      <button
        style={{
          display: "block"
        }} 
        type="submit"
      >
        Add Patient
      </button>
    </form>
  );
};