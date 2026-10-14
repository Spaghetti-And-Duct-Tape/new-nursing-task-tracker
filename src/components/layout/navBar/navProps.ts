import type { AppView } from "../../../types/layout";

export interface NavProps {
  activeView: AppView
  onNavigate: (AppView: AppView) => void;
  onAddPatient: () => void;
}