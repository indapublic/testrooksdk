export type AvailabilityType =
  | "INSTALLED"
  | "NOT_INSTALLED"
  | "NOT_SUPPORTED"
  | null;

export interface RookContextProps {
  availability: AvailabilityType;
  granted: boolean;
  requestPermissions: () => void;
}
