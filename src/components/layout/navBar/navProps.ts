import type { AppView } from "../../../types/layout";

export interface NavProps {
  activeView: AppView
  onNavigate: (view: AppView) => void;
  onAddPatient: () => void;
}