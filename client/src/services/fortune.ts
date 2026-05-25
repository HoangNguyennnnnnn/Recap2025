import { API_URL } from './api';
import { getToken, clearSession } from '../utils/auth';

const authFetch = async (url: string, options?: RequestInit): Promise<Response> => {
  const token = getToken();
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
  if (response.status === 401) {
    clearSession();
    window.location.href = '/login';
    throw new Error('Session expired');
  }
  return response;
};

export interface FortuneProfile {
  _id: string;
  slug: string;
  displayName: string;
  birthDate?: string;
  birthTime?: string;
  gender?: string;
  lastIngestAt?: string;
}

export interface FortuneSection {
  title: string;
  score?: number;
  subtitle?: string;
  summary?: string;
  details?: string[];
  warnings?: string[];
  action?: string;
  tags?: string[];
}

export interface FortuneElement {
  name: string;
  value: number;
  note?: string;
}

export interface FortuneTimelineItem {
  label: string;
  status: string;
  score?: number;
}

export interface FortuneChapter {
  index?: number;
  title: string;
  score?: number;
  focus?: string;
  strengths?: string[];
  cautions?: string[];
  action?: string;
  stars?: string[];
}

export interface FortunePalace {
  name: string;
  stars?: string[];
  location?: string;
  interpretation?: string;
}

export interface DetailedReading {
  introGeneral?: string;
  introGuide?: string;
  generalBanMenh?: string;
  generalCucMenh?: string;
  indicators?: {
    chuMenh?: string;
    chuThan?: string;
    laiNhan?: string;
    canLuong?: string;
    thanCu?: string;
  };
  palaceMenh?: string;
  palaceQuanLoc?: string;
  palaceTaiBach?: string;
  palacePhuThe?: string;
  palacePhuMau?: string;
  palaceHuynhDe?: string;
  palaceTuTuc?: string;
  palaceTatAch?: string;
  palaceDienTrach?: string;
  palaceNoBoc?: string;
  palacePhucDuc?: string;
  palaceThienDi?: string;
  yearly2026?: string;
  conclusion?: string;
}

export interface FortuneResult {
  profile: {
    displayName?: string;
    birthDate?: string;
    birthTime?: string;
    gender?: string;
  };
  headline?: string;
  overview?: string;
  score?: number;
  sections: FortuneSection[];
  elements?: FortuneElement[];
  timeline?: FortuneTimelineItem[];
  chapters?: FortuneChapter[];
  palaces?: FortunePalace[];
  detailedReading?: DetailedReading;
  highlights?: string[];
}

export interface GenerateFortunePayload {
  profileSlug: string;
  birthDate?: string;
  birthTime?: string;
  gender?: string;
  question?: string;
}

export const fetchFortuneProfiles = async (): Promise<FortuneProfile[]> => {
  const response = await authFetch(`${API_URL}/api/fortune/profiles`);
  if (!response.ok) {
    throw new Error('Failed to fetch profiles');
  }
  const data = await response.json();
  return data.profiles || [];
};

export const generateFortune = async (payload: GenerateFortunePayload): Promise<FortuneResult> => {
  const response = await authFetch(`${API_URL}/api/fortune/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate fortune');
  }
  return data.result as FortuneResult;
};

export const uploadFortunePdf = async (
  file: File,
  profileSlug: string,
  displayName?: string
): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('profileSlug', profileSlug);
  if (displayName) {
    formData.append('displayName', displayName);
  }
  // Don't use authFetch for FormData (let it set Authorization manually)
  const token = getToken();
  const response = await fetch(`${API_URL}/api/fortune/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (response.status === 401) {
    clearSession();
    window.location.href = '/login';
    throw new Error('Session expired');
  }
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to upload PDF');
  }
  return data;
};

export const purgeFortuneProfile = async (profileSlug: string): Promise<void> => {
  const response = await authFetch(`${API_URL}/api/fortune/purge/${profileSlug}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to purge profile');
  }
};

export const reingestFortune = async (profileSlug: string): Promise<{ chunkCount: number; hasParsedResult: boolean }> => {
  const response = await authFetch(`${API_URL}/api/fortune/reingest/${profileSlug}`, {
    method: 'POST',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to re-ingest');
  return data;
};
