import type { Speaker, SpeakerRole } from '@/data/speakers';

export type SpeakerFilterKey = 'all' | 'lectures' | 'panels' | 'chairs';

export const SPEAKER_FILTERS: { key: SpeakerFilterKey; label: string; roles: SpeakerRole[] | null }[] = [
  { key: 'all', label: 'All', roles: null },
  { key: 'lectures', label: 'Lectures', roles: ['lecture', 'workshop'] },
  { key: 'panels', label: 'Panels', roles: ['moderator', 'panelist'] },
  { key: 'chairs', label: 'Chairs', roles: ['chair', 'cochair'] },
];

/**
 * Keeps speakers that have at least one appearance in the selected group and
 * whose name, designation, institution or session names contain `query`.
 */
export function filterSpeakers(speakers: Speaker[], filter: SpeakerFilterKey, query: string): Speaker[] {
  const roles = SPEAKER_FILTERS.find((f) => f.key === filter)?.roles ?? null;
  const q = query.trim().toLowerCase();

  return speakers.filter((speaker) => {
    if (roles && !speaker.appearances.some((a) => roles.includes(a.role))) return false;
    if (!q) return true;
    return [speaker.name, speaker.designation, speaker.institution, ...speaker.appearances.map((a) => a.session)]
      .filter((field): field is string => Boolean(field))
      .some((field) => field.toLowerCase().includes(q));
  });
}
