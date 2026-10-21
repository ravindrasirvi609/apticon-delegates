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
  { id: 'd1-01', time: '08:30 – 10:00', title: 'Registration', type: 'logistics', hall: 'Auditorium Lobby' },
  { id: 'd1-10', time: '08:30 – 10:00', title: 'Breakfast', type: 'break', hall: 'Cafeteria' },
  { id: 'd1-02', time: '10:30 – 12:00', title: 'Inaugural Function', type: 'inaugural', hall: 'Main Auditorium' },
  { id: 'd1-11', time: '12:00 – 13:20', title: 'Technical Session 1', type: 'scientific', hall: 'Main Auditorium', description: 'KLE Oration Lecture; Dr. G. Bhagwant Memorial Lecture; Panel Discussion I — Pharma Teacher’s Sankalp: From Teaching to Transforming Competencies.' },
  { id: 'd1-04', time: '14:00 – 14:30', title: 'Lunch', type: 'break', hall: 'Cafeteria' },
  { id: 'd1-12', time: '14:30 – 17:00', title: 'Technical Session 2', type: 'scientific', hall: 'Main Auditorium', description: 'M. L. Schroff Memorial Lecture; Dr. G. P. Srivastava Memorial Lecture; Shri A. Mishra Memorial Lecture in Pharmaceutical Technology; Workshop on AI Softwares.' },
  { id: 'd1-13', time: '14:30 – 17:30', title: 'Oral/Poster Presentations', type: 'scientific', hall: 'Main Lobby' },
  { id: 'd1-09', time: '17:15 – 20:00', title: 'Award Function and Cultural Night', type: 'cultural', hall: 'Main Auditorium' },
  { id: 'd1-14', time: '20:00 – 22:00', title: 'Dinner', type: 'break', hall: 'Cafeteria' },
];

export const SCHEDULE_DAY2: ScheduleSession[] = [
  { id: 'd2-09', time: '08:00 – 09:30', title: 'Breakfast', type: 'break', hall: 'Cafeteria' },
  { id: 'd2-10', time: '09:30 – 10:10', title: 'J. S. S. Oration Lecture', type: 'keynote', hall: 'Main Auditorium', description: 'Prof. M. D. Burande, JSPM University, Pune. Chair: Dr. Surendra H. Bodake. Co-chair: Dr. Mohammed Haneefa.' },
  { id: 'd2-11', time: '10:00 – 12:00', title: 'Oral/Poster Presentations', type: 'scientific', hall: 'Main Lobby' },
  { id: 'd2-12', time: '10:10 – 11:10', title: 'Women Forum Event — Panel Discussion II', type: 'panel', hall: 'Main Auditorium', description: 'Women in Pharma: From Empowerment to Leadership for Viksit Bharat @2047. Moderator: Prof. Vandana Soni.' },
  { id: 'd2-13', time: '11:10 – 11:50', title: '54th IPC Trust Sponsored Lecture', type: 'keynote', hall: 'Main Auditorium', description: 'Prof. Sanjay Jain, Dr. H. S. Gour University, Sagar. Chair: Prof. N. V. V. Jagan Mohan Reddy. Co-chair: Dr. K. Venkat Ramanna.' },
  { id: 'd2-14', time: '11:50 – 12:50', title: 'Panel Discussion III', type: 'panel', hall: 'Main Auditorium', description: 'From Classroom to Pharmaceutical Innovation: Connecting Academia and Industry. Moderator: Prof. Rohit Dutt.' },
  { id: 'd2-04', time: '13:00 – 14:00', title: 'Lunch', type: 'break', hall: 'Cafeteria' },
  { id: 'd2-08', time: '14:00 – 16:00', title: 'Valedictory Function', type: 'valedictory', hall: 'Main Auditorium', description: 'Release of APTI journals and newsletters; Awards & Felicitation Ceremony; APTI Annual General Body Meeting.' },
];
