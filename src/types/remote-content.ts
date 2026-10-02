import type { ImageSourcePropType } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { ScheduleSession } from '@/data/schedule';
import type { CommitteeGroup, CommitteeMember, StateBranch } from '@/data/committee';
import type { TransportOption, Hotel, CuisineItem, RaipurPlace } from '@/data/venue';

/**
 * Images and icons bundled in the app use a `require()`/component reference.
 * Remote JSON can only ever supply a plain string (a URL, or an icon key).
 * These unions let a screen accept either without transforming the bundled
 * `src/data/*.ts` fallback constants at all.
 */
export type RemoteImage = ImageSourcePropType | string;
export type RemoteIcon = LucideIcon | string;

// ---------- Schedule ----------
export interface ScheduleData {
  day1: ScheduleSession[];
  day2: ScheduleSession[];
}

// ---------- Committee ----------
export interface RemoteCommitteeMember extends Omit<CommitteeMember, 'image'> {
  image?: RemoteImage;
}
export interface RemoteCommitteeGroup extends Omit<CommitteeGroup, 'members'> {
  members: RemoteCommitteeMember[];
}
export interface RemoteStateBranch extends Omit<StateBranch, 'members'> {
  members: RemoteCommitteeMember[];
}
export interface CommitteeData {
  pinnedGroups: RemoteCommitteeGroup[];
  stateBranches: RemoteStateBranch[];
}

// ---------- Venue ----------
export interface RemoteVenueInfo {
  name: string;
  address: string;
  lat: number;
  lng: number;
  features: string[];
}
export interface RemoteTransportOption extends Omit<TransportOption, 'icon'> {
  icon: RemoteIcon;
}
export interface RemoteRaipurPlace extends Omit<RaipurPlace, 'image'> {
  image: RemoteImage;
}
export interface VenueData {
  venue: RemoteVenueInfo;
  transport: RemoteTransportOption[];
  hotels: Hotel[];
  cuisine: CuisineItem[];
  raipurPlaces: RemoteRaipurPlace[];
}

// ---------- Event ----------
export interface RemoteEventInfo {
  name: string;
  edition: string;
  theme: string;
  themeHindi: string;
  vision: string;
  dateDisplay: string;
  startDate: Date | string;
  venueName: string;
  venueAddress: string;
  host: string;
  partner: string;
  contact: string;
}
export interface EventStat {
  value: string;
  label: string;
}
export interface EventData {
  event: RemoteEventInfo;
  stats: readonly EventStat[];
}
