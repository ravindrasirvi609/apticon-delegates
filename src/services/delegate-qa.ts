import { apiRequest } from './api';

/** Whether the server currently accepts questions/feedback for a session (authoritative). */
export interface SessionWindow {
  open: boolean;
  reason?: 'not_started' | 'closed';
  opensAt: string;
  closesAt: string;
}

export type QuestionStatus = 'pending' | 'approved' | 'answered' | 'hidden';

export interface MyQuestion {
  id: string;
  text: string;
  isAnonymous: boolean;
  status: QuestionStatus;
  createdAt: string;
}

export interface MyFeedback {
  rating: number;
  comment: string;
  updatedAt: string;
}

const sessionPath = (sessionId: string) => `/delegate/sessions/${encodeURIComponent(sessionId)}`;

export function fetchMyQuestions(token: string, sessionId: string) {
  return apiRequest<{ questions: MyQuestion[]; window: SessionWindow; maxQuestions: number }>(
    `${sessionPath(sessionId)}/questions`,
    { token }
  );
}

export function askQuestion(token: string, sessionId: string, text: string, isAnonymous: boolean) {
  return apiRequest<{ question: MyQuestion; window: SessionWindow }>(
    `${sessionPath(sessionId)}/questions`,
    { method: 'POST', token, body: { text, isAnonymous } }
  );
}

export function fetchMyFeedback(token: string, sessionId: string) {
  return apiRequest<{ feedback: MyFeedback | null; window: SessionWindow }>(
    `${sessionPath(sessionId)}/feedback`,
    { token }
  );
}

export function saveFeedback(token: string, sessionId: string, rating: number, comment: string) {
  return apiRequest<{ feedback: MyFeedback; window: SessionWindow }>(
    `${sessionPath(sessionId)}/feedback`,
    { method: 'PUT', token, body: { rating, comment } }
  );
}
