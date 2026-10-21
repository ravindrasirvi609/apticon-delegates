import { filterSpeakers } from './speaker-filter';
import type { Speaker } from '@/data/speakers';

const speakers: Speaker[] = [
  {
    name: 'Prof. Vandana Patravale',
    designation: 'Professor, Pharmaceutics',
    institution: 'Institute of Chemical Technology, Mumbai',
    appearances: [
      { role: 'lecture', session: 'M. L. Schroff Memorial Lecture', sessionId: 'd1-18' },
      { role: 'panelist', session: 'Panel Discussion II — Women Forum', sessionId: 'd2-12' },
    ],
  },
  {
    name: 'Prof. Rohit Dutt',
    designation: 'Vice-President, APTI North Zone',
    appearances: [{ role: 'moderator', session: 'Panel Discussion III', sessionId: 'd2-14' }],
  },
  {
    name: 'Dr. Mohammed Haneefa',
    institution: 'Moulana College of Pharmacy, Angadippuram, Kerala',
    appearances: [{ role: 'cochair', session: 'J. S. S. Oration Lecture', sessionId: 'd2-10' }],
  },
];

const names = (list: Speaker[]) => list.map((s) => s.name);

describe('filterSpeakers', () => {
  it('returns everyone for the all filter with no query', () => {
    expect(filterSpeakers(speakers, 'all', '')).toHaveLength(3);
  });

  it('groups by role and keeps people who appear in more than one group in each', () => {
    expect(names(filterSpeakers(speakers, 'lectures', ''))).toEqual(['Prof. Vandana Patravale']);
    expect(names(filterSpeakers(speakers, 'panels', ''))).toEqual(['Prof. Vandana Patravale', 'Prof. Rohit Dutt']);
    expect(names(filterSpeakers(speakers, 'chairs', ''))).toEqual(['Dr. Mohammed Haneefa']);
  });

  it('matches the query against name, designation, institution and session, case-insensitively', () => {
    expect(names(filterSpeakers(speakers, 'all', 'RUNGTA'))).toEqual([]);
    expect(names(filterSpeakers(speakers, 'all', 'haneefa'))).toEqual(['Dr. Mohammed Haneefa']);
    expect(names(filterSpeakers(speakers, 'all', 'north zone'))).toEqual(['Prof. Rohit Dutt']);
    expect(names(filterSpeakers(speakers, 'all', 'kerala'))).toEqual(['Dr. Mohammed Haneefa']);
    expect(names(filterSpeakers(speakers, 'all', 'schroff'))).toEqual(['Prof. Vandana Patravale']);
  });

  it('combines the group filter with the query', () => {
    expect(names(filterSpeakers(speakers, 'chairs', 'patravale'))).toEqual([]);
  });
});
