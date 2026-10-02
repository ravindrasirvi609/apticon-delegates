import { SESSION_COLORS } from '@/data/schedule';
import { KNOWN_ICON_KEYS } from '@/utils/icon-map';
import type { ScheduleData, CommitteeData, VenueData, EventData } from '@/types/remote-content';

/**
 * Lightweight, dependency-free shape checks for hand-edited remote JSON.
 * Each `isValid*Data` validates a whole file at once (all-or-nothing): one
 * bad item anywhere invalidates the file for this session, which is simpler
 * and safer than trying to partially recover a malformed hand-edit.
 */

const SESSION_TYPES = new Set(Object.keys(SESSION_COLORS));

const isStr = (v: unknown): v is string => typeof v === 'string';
const isNonEmptyStr = (v: unknown): v is string => isStr(v) && v.trim().length > 0;
const isStrArray = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr);
const isNum = (v: unknown): v is number => typeof v === 'number' && !Number.isNaN(v);
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

// ---------- Schedule ----------
function isValidSession(item: unknown): boolean {
  if (!isObj(item)) return false;
  return (
    isNonEmptyStr(item.time) &&
    isNonEmptyStr(item.title) &&
    isNonEmptyStr(item.hall) &&
    isNonEmptyStr(item.type) &&
    SESSION_TYPES.has(item.type) &&
    (item.description === undefined || isStr(item.description))
  );
}

export function isValidScheduleData(data: unknown): data is ScheduleData {
  if (!isObj(data)) return false;
  return (
    Array.isArray(data.day1) && data.day1.length > 0 && data.day1.every(isValidSession) &&
    Array.isArray(data.day2) && data.day2.length > 0 && data.day2.every(isValidSession)
  );
}

// ---------- Committee ----------
function isValidMember(item: unknown): boolean {
  if (!isObj(item)) return false;
  if (!isNonEmptyStr(item.name)) return false;
  for (const key of ['role', 'designation', 'institution', 'email'] as const) {
    if (item[key] !== undefined && !isStr(item[key])) return false;
  }
  if (item.image !== undefined && !isStr(item.image)) return false;
  return true;
}

function isValidGroup(item: unknown): boolean {
  if (!isObj(item)) return false;
  return (
    isNonEmptyStr(item.key) &&
    isNonEmptyStr(item.title) &&
    Array.isArray(item.gradient) && item.gradient.length === 2 && item.gradient.every(isStr) &&
    Array.isArray(item.members) && item.members.every(isValidMember)
  );
}

function isValidBranch(item: unknown): boolean {
  if (!isObj(item)) return false;
  return isNonEmptyStr(item.state) && Array.isArray(item.members) && item.members.every(isValidMember);
}

export function isValidCommitteeData(data: unknown): data is CommitteeData {
  if (!isObj(data)) return false;
  return (
    Array.isArray(data.pinnedGroups) && data.pinnedGroups.every(isValidGroup) &&
    Array.isArray(data.stateBranches) && data.stateBranches.every(isValidBranch) &&
    (data.pinnedGroups.length > 0 || data.stateBranches.length > 0)
  );
}

// ---------- Venue ----------
function isValidVenueInfo(v: unknown): boolean {
  if (!isObj(v)) return false;
  return (
    isNonEmptyStr(v.name) && isNonEmptyStr(v.address) && isNum(v.lat) && isNum(v.lng) &&
    isStrArray(v.features) && v.features.length > 0
  );
}
function isValidTransport(item: unknown): boolean {
  if (!isObj(item)) return false;
  return (
    isNonEmptyStr(item.icon) && KNOWN_ICON_KEYS.has(item.icon) &&
    isNonEmptyStr(item.label) && isNonEmptyStr(item.title) &&
    isStrArray(item.details) && item.details.length > 0
  );
}
function isValidHotel(item: unknown): boolean {
  if (!isObj(item)) return false;
  return isNonEmptyStr(item.name) && isNum(item.stars) && isNonEmptyStr(item.distance) && isNonEmptyStr(item.area);
}
function isValidCuisine(item: unknown): boolean {
  if (!isObj(item)) return false;
  return isNonEmptyStr(item.name) && isNonEmptyStr(item.desc) && isNonEmptyStr(item.icon);
}
function isValidPlace(item: unknown): boolean {
  if (!isObj(item)) return false;
  return (
    isNonEmptyStr(item.name) && isNonEmptyStr(item.description) &&
    isNonEmptyStr(item.icon) && isNonEmptyStr(item.image)
  );
}

export function isValidVenueData(data: unknown): data is VenueData {
  if (!isObj(data)) return false;
  return (
    isValidVenueInfo(data.venue) &&
    Array.isArray(data.transport) && data.transport.length > 0 && data.transport.every(isValidTransport) &&
    Array.isArray(data.hotels) && data.hotels.length > 0 && data.hotels.every(isValidHotel) &&
    Array.isArray(data.cuisine) && data.cuisine.every(isValidCuisine) &&
    Array.isArray(data.raipurPlaces) && data.raipurPlaces.length > 0 && data.raipurPlaces.every(isValidPlace)
  );
}

// ---------- Event ----------
function isValidEventInfo(v: unknown): boolean {
  if (!isObj(v)) return false;
  const requiredStrings = [
    'name', 'edition', 'theme', 'themeHindi', 'vision',
    'dateDisplay', 'venueName', 'venueAddress', 'host', 'partner', 'contact',
  ] as const;
  if (!requiredStrings.every((k) => isNonEmptyStr(v[k]))) return false;
  if (!isNonEmptyStr(v.startDate)) return false;
  return !Number.isNaN(new Date(v.startDate).getTime());
}
function isValidStat(item: unknown): boolean {
  if (!isObj(item)) return false;
  return isNonEmptyStr(item.value) && isNonEmptyStr(item.label);
}

export function isValidEventData(data: unknown): data is EventData {
  if (!isObj(data)) return false;
  return (
    isValidEventInfo(data.event) &&
    Array.isArray(data.stats) && data.stats.length > 0 && data.stats.every(isValidStat)
  );
}
