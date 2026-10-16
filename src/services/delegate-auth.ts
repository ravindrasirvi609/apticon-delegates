import { apiRequest } from './api';

export interface Delegate {
  id: string;
  name: string;
  registrationCode: string;
  institution: string;
}

export interface DelegateLoginResult {
  token: string;
  delegate: Delegate;
}

export function loginDelegate(registrationCode: string, email: string): Promise<DelegateLoginResult> {
  return apiRequest<DelegateLoginResult>('/delegate/auth/login', {
    method: 'POST',
    body: { registrationCode, email },
  });
}

export async function fetchDelegateMe(token: string): Promise<Delegate> {
  const data = await apiRequest<{ delegate: Delegate }>('/delegate/auth/me', { token });
  return data.delegate;
}
