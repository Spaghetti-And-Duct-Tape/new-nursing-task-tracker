import { useAssignment } from "./hooks/useAssignment";
import AppLayout from "./components/layout/appLayout/appLayout";



export default function App() {
  const {
    assignment,
    addPatient,
    updatePatient
  } = useAssignment();
  
  return (
    <AppLayout
      assignment={assignment}
      onAddPatient={addPatient}
      updatePatient={updatePatient}
    />
  )
};