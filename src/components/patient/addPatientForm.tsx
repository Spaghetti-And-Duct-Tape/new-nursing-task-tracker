import { useState } from "react";
import type { CareModule } from "../../types/careModule";
import type { Patient } from "../../types/patient";

type PatientStatus = 
  | "icu"
  | "tele"
  | "med-surg";

type NeuroFrequency = 
  | "none"
  | "1"
  | "2"
  | "4"
  | "8";

type Mobility = 
  | "independent"
  | "dependent";

interface PatientFormData {
  room: string;
  status: PatientStatus;
  neuro: NeuroFrequency;
  mobility: Mobility;

  sedation: boolean;
  analgesia: boolean;
  restraints: boolean;
  admission: boolean;
};

const initialFormData: PatientFormData = {
  room: "",
  status: "icu",
  neuro: "none",
  
  mobility: "independent",

  sedation: false,
  analgesia: false,
  restraints: false,
  admission: false
}

interface AddPatientFormProps {
  modules: CareModule[];
  onAddPatient: (patient: Patient) => void;
}

export function AddPatientForm({
  modules,
  onAddPatient
}: AddPatientFormProps) {
  const [formData, setFormData] = useState<PatientFormData>(initialFormData);


  function handleSubmit() {
    const { 
      room, 
      status, 
      neuro, 
      mobility, 
      sedation, 
      analgesia,
      admission
    } = formData;

    setFormData(initialFormData)
  };

  return (
    <section>
      <h2>Add Patient</h2>

      <label>
        <p>Room</p>

        <input
          value={formData.room}
          onChange={e => 
            setFormData({
              ...formData,
              room: e.target.value
          })
          }
        />
      </label>

      <label>
        Status 

        <select
          value={formData.status}
          onChange={e => 
            setFormData({
              ...formData,
              status: e.target.value as PatientStatus
            })
          }
        >
          <option value={"icu"}>ICU</option>
          <option value={"tele"}>Tele</option>
          <option value={"med-surg"}>Med/Surg</option>
        </select>
      </label>

      <button
        style={{
          display: "block"
        }} 
        onClick={handleSubmit}
      >
        Add Patient
      </button>
    </section>
  )
};