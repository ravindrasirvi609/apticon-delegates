import type { ImageSourcePropType } from 'react-native';

export interface CommitteeMember {
  name: string;
  role?: string;
  designation?: string;
  institution?: string;
  email?: string;
  image?: ImageSourcePropType;
}

export interface StateBranch {
  state: string;
  members: CommitteeMember[];
}

// Only the fields actually used for matching — kept generic so remote-fetched
// member/branch shapes (which widen `image` to allow a plain URL string) can
// reuse this logic without a cast. See `src/types/remote-content.ts`.
type SearchableMember = Pick<CommitteeMember, 'name' | 'role' | 'designation' | 'institution'>;

export function memberMatches<M extends SearchableMember>(member: M, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [member.name, member.role, member.designation, member.institution]
    .filter((field): field is string => Boolean(field))
    .some((field) => field.toLowerCase().includes(q));
}

export function filterStateBranches<M extends SearchableMember, B extends { state: string; members: M[] }>(
  branches: B[],
  query: string
): B[] {
  const q = query.trim().toLowerCase();
  if (!q) return branches;
  return branches
    .map((branch) => ({
      ...branch,
      members: branch.state.toLowerCase().includes(q)
        ? branch.members
        : branch.members.filter((m) => memberMatches(m, q)),
    }))
    .filter((branch) => branch.members.length > 0);
}
