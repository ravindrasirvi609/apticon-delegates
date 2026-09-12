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

export function memberMatches(member: CommitteeMember, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [member.name, member.role, member.designation, member.institution]
    .filter((field): field is string => Boolean(field))
    .some((field) => field.toLowerCase().includes(q));
}

export function filterStateBranches(branches: StateBranch[], query: string): StateBranch[] {
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
