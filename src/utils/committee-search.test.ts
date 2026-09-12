import { memberMatches, filterStateBranches, type StateBranch } from './committee-search';

const branches: StateBranch[] = [
  {
    state: 'Chhattisgarh',
    members: [
      { name: 'Amber Vyas', role: 'President', designation: 'Assistant Professor', institution: 'UIP, Raipur' },
      { name: 'Dr. Ajazuddin', role: 'Vice President', designation: 'Principal', institution: 'Rungta College' },
    ],
  },
  {
    state: 'Kerala',
    members: [
      { name: 'Dr. Mohammed Haneefa K P', role: 'President', designation: 'Principal', institution: 'Moulana College' },
    ],
  },
];

describe('memberMatches', () => {
  it('matches case-insensitively on name', () => {
    expect(memberMatches(branches[0].members[0], 'amber')).toBe(true);
  });

  it('matches on institution', () => {
    expect(memberMatches(branches[0].members[1], 'rungta')).toBe(true);
  });

  it('returns false when nothing matches', () => {
    expect(memberMatches(branches[0].members[0], 'nonexistent')).toBe(false);
  });

  it('treats an empty query as a match', () => {
    expect(memberMatches(branches[0].members[0], '')).toBe(true);
  });
});

describe('filterStateBranches', () => {
  it('keeps a whole branch when the state name matches', () => {
    const result = filterStateBranches(branches, 'chhattisgarh');
    expect(result).toHaveLength(1);
    expect(result[0].members).toHaveLength(2);
  });

  it('keeps only matching members within a branch otherwise', () => {
    const result = filterStateBranches(branches, 'ajazuddin');
    expect(result).toHaveLength(1);
    expect(result[0].state).toBe('Chhattisgarh');
    expect(result[0].members).toHaveLength(1);
  });

  it('drops branches with no matches', () => {
    const result = filterStateBranches(branches, 'nonexistent');
    expect(result).toHaveLength(0);
  });

  it('returns everything unchanged for an empty query', () => {
    expect(filterStateBranches(branches, '')).toEqual(branches);
  });
});
