export type SessionType =
  | 'inaugural'
  | 'keynote'
  | 'scientific'
  | 'workshop'
  | 'panel'
  | 'cultural'
  | 'valedictory'
  | 'break'
  | 'logistics';

export interface ScheduleSession {
  /** Stable id (e.g. 'd1-03'). The backend keys questions and feedback on it: never reuse or renumber. */
  id: string;
  time: string;
  title: string;
  type: SessionType;
  hall: string;
  description?: string;
}

export const SESSION_COLORS: Record<SessionType, { bg: string; text: string }> = {
  inaugural: { bg: '#312E81', text: '#FFFFFF' },
  keynote: { bg: '#1E293B', text: '#FFFFFF' },
  scientific: { bg: '#047857', text: '#FFFFFF' },
  workshop: { bg: '#7E22CE', text: '#FFFFFF' },
  panel: { bg: '#C2410C', text: '#FFFFFF' },
  cultural: { bg: '#BE185D', text: '#FFFFFF' },
  valedictory: { bg: '#EA580C', text: '#0F172A' },
  break: { bg: '#E5E7EB', text: '#374151' },
  logistics: { bg: '#F3F4F6', text: '#4B5563' },
};

export const SCHEDULE_DAY1: ScheduleSession[] = [
  { id: 'd1-01', time: '09:00 – 10:00', title: 'Registration & Welcome Kit Distribution', type: 'logistics', hall: 'Main Lobby' },
  { id: 'd1-02', time: '10:00 – 11:30', title: 'Inaugural Ceremony', type: 'inaugural', hall: 'Main Auditorium', description: 'Lamp lighting, welcome address, release of souvenir' },
  { id: 'd1-03', time: '11:30 – 12:30', title: 'Presidential Address', type: 'keynote', hall: 'Main Auditorium' },
  { id: 'd1-04', time: '12:30 – 13:30', title: 'Lunch & Networking', type: 'break', hall: 'Dining Hall' },
  { id: 'd1-05', time: '13:30 – 15:00', title: "Keynote: Viksit Bharat 2047 — Pharmacy's Role", type: 'keynote', hall: 'Main Auditorium' },
  { id: 'd1-06', time: '15:00 – 16:30', title: 'Scientific Session I: Pharmaceutical Education Innovation', type: 'scientific', hall: 'Hall A' },
  { id: 'd1-07', time: '16:30 – 17:00', title: 'Tea Break', type: 'break', hall: 'Foyer' },
  { id: 'd1-08', time: '17:00 – 18:30', title: 'Scientific Session II: Drug Discovery & Development', type: 'scientific', hall: 'Hall A' },
  { id: 'd1-09', time: '19:00 – 21:00', title: 'Cultural Evening — Chhattisgarhi Folk Performances', type: 'cultural', hall: 'Open Stage' },
];

export const SCHEDULE_DAY2: ScheduleSession[] = [
  { id: 'd2-01', time: '09:00 – 10:30', title: 'Keynote: Atmanirbhar Bharat — Indigenous Pharma', type: 'keynote', hall: 'Main Auditorium' },
  { id: 'd2-02', time: '10:30 – 12:00', title: 'Scientific Session III: Clinical Pharmacy & Pharmacovigilance', type: 'scientific', hall: 'Hall A' },
  { id: 'd2-03', time: '12:00 – 13:00', title: 'Workshop: Outcome-Based Pharmacy Education', type: 'workshop', hall: 'Hall B' },
  { id: 'd2-04', time: '13:00 – 14:00', title: 'Lunch', type: 'break', hall: 'Dining Hall' },
  { id: 'd2-05', time: '14:00 – 15:30', title: 'Scientific Session IV: Herbal Medicine & Traditional Knowledge', type: 'scientific', hall: 'Hall A' },
  { id: 'd2-06', time: '15:30 – 16:00', title: 'Tea Break', type: 'break', hall: 'Foyer' },
  { id: 'd2-07', time: '16:00 – 17:00', title: 'Panel Discussion: Future of Pharmacy Education in India', type: 'panel', hall: 'Main Auditorium' },
  { id: 'd2-08', time: '17:00 – 18:00', title: 'Valedictory Ceremony & Awards', type: 'valedictory', hall: 'Main Auditorium' },
];
