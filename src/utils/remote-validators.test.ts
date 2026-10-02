import {
  isValidScheduleData,
  isValidCommitteeData,
  isValidVenueData,
  isValidEventData,
} from './remote-validators';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const scheduleJson = require('../../remote-data/schedule.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const committeeJson = require('../../remote-data/committee.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const venueJson = require('../../remote-data/venue.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const eventJson = require('../../remote-data/event.json');

describe('isValidScheduleData', () => {
  it('accepts the real seeded schedule.json', () => {
    expect(isValidScheduleData(scheduleJson)).toBe(true);
  });

  it('rejects a non-object', () => {
    expect(isValidScheduleData(null)).toBe(false);
    expect(isValidScheduleData('nope')).toBe(false);
  });

  it('rejects an empty day array', () => {
    expect(isValidScheduleData({ ...scheduleJson, day1: [] })).toBe(false);
  });

  it('rejects a session with an unknown type', () => {
    const bad = { ...scheduleJson, day1: [{ ...scheduleJson.day1[0], type: 'bogus' }] };
    expect(isValidScheduleData(bad)).toBe(false);
  });

  it('rejects a session missing a required field', () => {
    const { time, ...rest } = scheduleJson.day1[0];
    const bad = { ...scheduleJson, day1: [rest] };
    expect(isValidScheduleData(bad)).toBe(false);
  });
});

describe('isValidCommitteeData', () => {
  it('accepts the real seeded committee.json', () => {
    expect(isValidCommitteeData(committeeJson)).toBe(true);
  });

  it('accepts a member with only name set', () => {
    expect(
      isValidCommitteeData({ pinnedGroups: [], stateBranches: [{ state: 'Test', members: [{ name: 'Only Name' }] }] })
    ).toBe(true);
  });

  it('rejects a member missing name', () => {
    expect(
      isValidCommitteeData({ pinnedGroups: [], stateBranches: [{ state: 'Test', members: [{ role: 'President' }] }] })
    ).toBe(false);
  });

  it('rejects when both top-level arrays are empty', () => {
    expect(isValidCommitteeData({ pinnedGroups: [], stateBranches: [] })).toBe(false);
  });

  it('rejects a non-object', () => {
    expect(isValidCommitteeData([])).toBe(false);
  });
});

describe('isValidVenueData', () => {
  it('accepts the real seeded venue.json', () => {
    expect(isValidVenueData(venueJson)).toBe(true);
  });

  it('rejects an unknown transport icon key', () => {
    const bad = { ...venueJson, transport: [{ ...venueJson.transport[0], icon: 'bicycle' }] };
    expect(isValidVenueData(bad)).toBe(false);
  });

  it('rejects an empty raipurPlaces array', () => {
    expect(isValidVenueData({ ...venueJson, raipurPlaces: [] })).toBe(false);
  });

  it('allows an empty cuisine array', () => {
    expect(isValidVenueData({ ...venueJson, cuisine: [] })).toBe(true);
  });
});

describe('isValidEventData', () => {
  it('accepts the real seeded event.json', () => {
    expect(isValidEventData(eventJson)).toBe(true);
  });

  it('rejects an unparseable startDate', () => {
    const bad = { ...eventJson, event: { ...eventJson.event, startDate: 'not-a-date' } };
    expect(isValidEventData(bad)).toBe(false);
  });

  it('rejects an empty stats array', () => {
    expect(isValidEventData({ ...eventJson, stats: [] })).toBe(false);
  });
});
