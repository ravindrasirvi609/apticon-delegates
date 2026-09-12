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
  { time: '09:00 – 10:00', title: 'Registration & Welcome Kit Distribution', type: 'logistics', hall: 'Main Lobby' },
  { time: '10:00 – 11:30', title: 'Inaugural Ceremony', type: 'inaugural', hall: 'Main Auditorium', description: 'Lamp lighting, welcome address, release of souvenir' },
  { time: '11:30 – 12:30', title: 'Presidential Address', type: 'keynote', hall: 'Main Auditorium' },
  { time: '12:30 – 13:30', title: 'Lunch & Networking', type: 'break', hall: 'Dining Hall' },
  { time: '13:30 – 15:00', title: "Keynote: Viksit Bharat 2047 — Pharmacy's Role", type: 'keynote', hall: 'Main Auditorium' },
  { time: '15:00 – 16:30', title: 'Scientific Session I: Pharmaceutical Education Innovation', type: 'scientific', hall: 'Hall A' },
  { time: '16:30 – 17:00', title: 'Tea Break', type: 'break', hall: 'Foyer' },
  { time: '17:00 – 18:30', title: 'Scientific Session II: Drug Discovery & Development', type: 'scientific', hall: 'Hall A' },
  { time: '19:00 – 21:00', title: 'Cultural Evening — Chhattisgarhi Folk Performances', type: 'cultural', hall: 'Open Stage' },
];

export const SCHEDULE_DAY2: ScheduleSession[] = [
  { time: '09:00 – 10:30', title: 'Keynote: Atmanirbhar Bharat — Indigenous Pharma', type: 'keynote', hall: 'Main Auditorium' },
  { time: '10:30 – 12:00', title: 'Scientific Session III: Clinical Pharmacy & Pharmacovigilance', type: 'scientific', hall: 'Hall A' },
  { time: '12:00 – 13:00', title: 'Workshop: Outcome-Based Pharmacy Education', type: 'workshop', hall: 'Hall B' },
  { time: '13:00 – 14:00', title: 'Lunch', type: 'break', hall: 'Dining Hall' },
  { time: '14:00 – 15:30', title: 'Scientific Session IV: Herbal Medicine & Traditional Knowledge', type: 'scientific', hall: 'Hall A' },
  { time: '15:30 – 16:00', title: 'Tea Break', type: 'break', hall: 'Foyer' },
  { time: '16:00 – 17:00', title: 'Panel Discussion: Future of Pharmacy Education in India', type: 'panel', hall: 'Main Auditorium' },
  { time: '17:00 – 18:00', title: 'Valedictory Ceremony & Awards', type: 'valedictory', hall: 'Main Auditorium' },
];
