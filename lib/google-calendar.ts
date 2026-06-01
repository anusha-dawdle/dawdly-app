export const GCAL_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

const SCOPE = "https://www.googleapis.com/auth/calendar.readonly";
const TOKEN_KEY = "dawdly_goog_access_token";
const EXPIRY_KEY = "dawdly_goog_token_expiry";

export interface GCalEvent {
  id: string;
  summary?: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  status?: string;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  error?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient(config: {
            client_id: string;
            scope: string;
            callback: (resp: TokenResponse) => void;
          }): { requestAccessToken(): void };
        };
      };
    };
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(EXPIRY_KEY);
  if (!token || !expiry || Date.now() > Number(expiry) - 60_000) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    return null;
  }
  return token;
}

export function saveToken(token: string, expiresIn: number): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRY_KEY, String(Date.now() + expiresIn * 1000));
}

export function revokeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
}

let _gisLoad: Promise<void> | null = null;
function loadGIS(): Promise<void> {
  if (_gisLoad) return _gisLoad;
  _gisLoad = new Promise((resolve, reject) => {
    if (window.google?.accounts) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Google Identity Services"));
    document.head.appendChild(s);
  });
  return _gisLoad;
}

export function requestToken(
  onToken: (token: string) => void,
  onError: (msg: string) => void
): void {
  loadGIS()
    .then(() => {
      const client = window.google!.accounts.oauth2.initTokenClient({
        client_id: GCAL_CLIENT_ID,
        scope: SCOPE,
        callback: (resp) => {
          if (resp.error) { onError(resp.error); return; }
          saveToken(resp.access_token, resp.expires_in);
          onToken(resp.access_token);
        },
      });
      client.requestAccessToken();
    })
    .catch((e: Error) => onError(e.message));
}

export async function fetchUpcomingEvents(token: string): Promise<GCalEvent[]> {
  const params = new URLSearchParams({
    timeMin: new Date().toISOString(),
    timeMax: new Date(Date.now() + 90 * 86_400_000).toISOString(),
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "250",
  });
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (res.status === 401) { revokeToken(); throw new Error("auth"); }
  if (!res.ok) throw new Error(`Google Calendar error ${res.status}`);
  const data = await res.json();
  return (data.items ?? []).filter((e: GCalEvent) => e.status !== "cancelled");
}

export function gcalDate(d: { dateTime?: string; date?: string }): string {
  return (d.dateTime ?? d.date ?? "").slice(0, 10);
}

export function gcalTime(d: { dateTime?: string }): string | undefined {
  if (!d.dateTime) return undefined;
  const dt = new Date(d.dateTime);
  return `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
}

export function gcalIsAllDay(start: { dateTime?: string; date?: string }): boolean {
  return !!start.date && !start.dateTime;
}
