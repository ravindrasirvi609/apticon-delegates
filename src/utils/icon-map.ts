import { Plane, Train, Car, type LucideIcon } from 'lucide-react-native';

/** Maps a remote-JSON icon key to the actual Lucide component used in the bundled app. */
export const ICON_MAP: Record<string, LucideIcon> = {
  plane: Plane,
  train: Train,
  car: Car,
};

export const KNOWN_ICON_KEYS = new Set(Object.keys(ICON_MAP));

/** Safe default so an unrecognized/omitted icon key never crashes rendering. */
export const DEFAULT_ICON: LucideIcon = Car;

export function resolveIcon(key: string): LucideIcon {
  return ICON_MAP[key] ?? DEFAULT_ICON;
}
