import type { OralPresentation, PosterPresentation } from '@/data/presentations';

/** Sentinel for "no filter" on a chip row. */
export const ALL = 'all';

export interface OralFilters {
  query: string;
  slot: string;
  hall: string;
  subject: string;
}

export interface PosterFilters {
  query: string;
  day: string;
  subject: string;
}

type Searchable = OralPresentation | PosterPresentation;

/** 'O-PT-2' -> 'opt2', so a delegate can type the code with or without the dashes. */
const compactCode = (code: string) => code.toLowerCase().replace(/[^a-z0-9]/g, '');

function haystack(item: Searchable): string {
  const online = 'isOnline' in item && item.isOnline ? 'online' : '';
  return [item.code, compactCode(item.code), item.author, item.title, item.affiliation, item.subject, online]
    .join(' ')
    .toLowerCase();
}

/** Every space-separated word must appear somewhere (code, author, title, institution, subject). */
function matchesQuery(item: Searchable, query: string): boolean {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const text = haystack(item);
  return tokens.every((token) => text.includes(token));
}

export function filterOral(items: OralPresentation[], filters: OralFilters): OralPresentation[] {
  return items.filter(
    (item) =>
      (filters.slot === ALL || item.slot === filters.slot) &&
      (filters.hall === ALL || item.hall === filters.hall) &&
      (filters.subject === ALL || item.subject === filters.subject) &&
      matchesQuery(item, filters.query),
  );
}

export function filterPoster(items: PosterPresentation[], filters: PosterFilters): PosterPresentation[] {
  return items.filter(
    (item) =>
      (filters.day === ALL || item.day === filters.day) &&
      (filters.subject === ALL || item.subject === filters.subject) &&
      matchesQuery(item, filters.query),
  );
}

/** Distinct non-empty values, in the order first seen (the data is already in schedule order). */
export function uniqueInOrder(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

// Full subject names are far too long for a chip. Unknown subjects fall back to their full name,
// so a new subject added in the remote file still shows up (just wider).
const SUBJECT_SHORT_LABELS: Record<string, string> = {
  'Pharmaceutical Technology': 'Pharm. Technology',
  'Medicinal Chemistry': 'Medicinal Chemistry',
  'Pharmacognosy, Indigenous Drugs, Herbal Formulations and Phytochemistry': 'Pharmacognosy',
  'Pharmacology, Toxicology, Clinical Research & Pharmacovigilance': 'Pharmacology',
  'Pharmaceutical Analysis and Quality Assurance': 'Analysis & QA',
  'Biopharmaceutics, Pharmacokinetics & Drug Metabolism': 'Biopharmaceutics',
  'Pharmaceutical Education and Professional Pharmacy': 'Education',
  'Drug Regulatory Affairs & Pharmaceutical Management': 'Regulatory Affairs',
  'Artificial Intelligence / Bioinformatics / Data Analytics': 'AI & Bioinformatics',
};

export function subjectLabel(subject: string): string {
  return SUBJECT_SHORT_LABELS[subject] ?? subject;
}
