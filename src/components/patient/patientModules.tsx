import type { CareModule } from "../../types/careModule";
import type { Patient } from "../../types/patient";

interface PatientModuleProps {
  patient: Patient;
  careModules: CareModule[];
  onRemoveModule: (
    patientId: string,
    patientModuleId: string
  ) => void;
};

export default function PatientModules({
  patient, 
  careModules,
  onRemoveModule
}: PatientModuleProps) {
  return (
    <div 
      className="patient-modules"
    >
      {patient.modules.map(patientModule => {
        const module = careModules.find(
          module => module.id === patientModule.moduleId
        );

        if (!module) return null;

        return (
          <div
            key={patientModule.id}
            className="patient-module"
          >
            <div>
              <strong>{module.name}</strong>

              <span>
                {patientModule.persistent ? " Persistent " : " Temporary "}
              </span>

              <small>
                Added: {new Date(patientModule.addedAt).toLocaleString()}
              </small>
            </div>

            <button
              type="button"
              onClick={() => 
                onRemoveModule(patient.id, patientModule.id)
              }
            >
              Remove
            </button>
          </div>
        );
      })}
    </div>
  )
}