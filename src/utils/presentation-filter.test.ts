import { PRESENTATIONS, type OralPresentation, type PosterPresentation } from '@/data/presentations';
import { ALL, filterOral, filterPoster, subjectLabel, uniqueInOrder } from './presentation-filter';

const oral = (over: Partial<OralPresentation>): OralPresentation => ({
  code: 'O-PT-2',
  author: 'Dr Sandip Bandgar',
  title: 'Natamycin Loaded Solid Lipid Nanoparticle Gel',
  affiliation: 'Ashokrao Mane College of Pharmacy',
  subject: 'Pharmaceutical Technology',
  slot: 'Slot 1',
  hall: 'Oral Hall 1',
  day: 'Day 1',
  date: '24 Oct 2026',
  time: '2:30 PM – 3:30 PM',
  isOnline: false,
  ...over,
});

const poster = (over: Partial<PosterPresentation>): PosterPresentation => ({
  code: 'P-PC-10',
  author: 'Sumeet Dwivedi',
  title: 'Niosomal Polyherbal Gels for Vaginal Candidiasis',
  affiliation: 'Acropolis Institute, Indore',
  subject: 'Pharmacognosy, Indigenous Drugs, Herbal Formulations and Phytochemistry',
  day: 'Day 1',
  date: '24 Oct 2026',
  time: '2:30 PM – 3:30 PM',
  ...over,
});

const noFilter = { query: '', slot: ALL, hall: ALL, subject: ALL };
const codes = (list: { code: string }[]) => list.map((p) => p.code);

describe('filterOral', () => {
  const items = [
    oral({ code: 'O-PT-2' }),
    oral({ code: 'O-PT-3', author: 'Ayushmaan Roy', affiliation: 'Rungta College, Bhilai', hall: 'Oral Hall 2' }),
    oral({
      code: 'O-PC-9',
      author: 'Bharti Bhatia',
      subject: 'Pharmacognosy, Indigenous Drugs, Herbal Formulations and Phytochemistry',
      slot: 'Slot 3',
      day: 'Day 2',
      isOnline: true,
    }),
  ];

  it('returns everything with no filters', () => {
    expect(filterOral(items, noFilter)).toHaveLength(3);
  });

  it('filters by slot, hall and subject, combining them', () => {
    expect(codes(filterOral(items, { ...noFilter, slot: 'Slot 3' }))).toEqual(['O-PC-9']);
    expect(codes(filterOral(items, { ...noFilter, hall: 'Oral Hall 2' }))).toEqual(['O-PT-3']);
    expect(codes(filterOral(items, { ...noFilter, subject: 'Pharmaceutical Technology' }))).toEqual(['O-PT-2', 'O-PT-3']);
    expect(filterOral(items, { ...noFilter, slot: 'Slot 3', hall: 'Oral Hall 2' })).toEqual([]);
  });

  it('searches author, institution and title case-insensitively', () => {
    expect(codes(filterOral(items, { ...noFilter, query: 'AYUSHMAAN' }))).toEqual(['O-PT-3']);
    expect(codes(filterOral(items, { ...noFilter, query: 'rungta bhilai' }))).toEqual(['O-PT-3']);
    expect(codes(filterOral(items, { ...noFilter, query: 'nanoparticle' }))).toEqual(['O-PT-2', 'O-PT-3', 'O-PC-9']);
  });

  it('requires every word of a multi-word query to match', () => {
    expect(filterOral(items, { ...noFilter, query: 'rungta mane' })).toEqual([]);
  });

  it('finds a code with or without the dashes', () => {
    expect(codes(filterOral(items, { ...noFilter, query: 'o-pt-3' }))).toEqual(['O-PT-3']);
    expect(codes(filterOral(items, { ...noFilter, query: 'opt3' }))).toEqual(['O-PT-3']);
  });

  it('lets "online" find online presenters', () => {
    expect(codes(filterOral(items, { ...noFilter, query: 'online' }))).toEqual(['O-PC-9']);
  });

  it('ignores a whitespace-only query', () => {
    expect(filterOral(items, { ...noFilter, query: '   ' })).toHaveLength(3);
  });
});

describe('filterPoster', () => {
  const items = [
    poster({ code: 'P-PC-10' }),
    poster({ code: 'P-PT-5', author: 'Manik Bera', subject: 'Pharmaceutical Technology', day: 'Day 2' }),
  ];
  const none = { query: '', day: ALL, subject: ALL };

  it('filters by day and subject', () => {
    expect(codes(filterPoster(items, { ...none, day: 'Day 2' }))).toEqual(['P-PT-5']);
    expect(codes(filterPoster(items, { ...none, subject: 'Pharmaceutical Technology' }))).toEqual(['P-PT-5']);
  });

  it('searches by author and code', () => {
    expect(codes(filterPoster(items, { ...none, query: 'bera' }))).toEqual(['P-PT-5']);
    expect(codes(filterPoster(items, { ...none, query: 'ppc10' }))).toEqual(['P-PC-10']);
  });
});

describe('uniqueInOrder', () => {
  it('drops blanks and repeats but keeps first-seen order', () => {
    expect(uniqueInOrder(['Slot 2', 'Slot 1', '', 'Slot 2'])).toEqual(['Slot 2', 'Slot 1']);
  });
});

describe('subjectLabel', () => {
  it('shortens known subjects and falls back to the full name for unknown ones', () => {
    expect(subjectLabel('Pharmacognosy, Indigenous Drugs, Herbal Formulations and Phytochemistry')).toBe('Pharmacognosy');
    expect(subjectLabel('Some New Subject')).toBe('Some New Subject');
  });
});

describe('bundled presentations data', () => {
  const all = [...PRESENTATIONS.oral, ...PRESENTATIONS.poster];

  it('has the full oral and poster schedule', () => {
    expect(PRESENTATIONS.oral).toHaveLength(170);
    expect(PRESENTATIONS.poster).toHaveLength(447);
  });

  it('gives every item a clean day, date and time', () => {
    for (const item of all) {
      expect(['Day 1', 'Day 2']).toContain(item.day);
      expect(item.date).toBe(item.day === 'Day 1' ? '24 Oct 2026' : '25 Oct 2026');
      expect(item.time).toMatch(/^\d{1,2}:\d{2} [AP]M – \d{1,2}:\d{2} [AP]M$/);
    }
  });

  it('keeps every oral code unique after merging split rows', () => {
    const oralCodes = PRESENTATIONS.oral.map((p) => p.code);
    expect(new Set(oralCodes).size).toBe(oralCodes.length);
  });

  it('every subject has a short chip label', () => {
    for (const subject of uniqueInOrder(all.map((p) => p.subject))) {
      expect(subjectLabel(subject).length).toBeLessThan(25);
    }
  });
});
