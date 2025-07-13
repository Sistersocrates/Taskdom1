import { getSession } from '../lib/supabase';

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
}

class GoogleCalendarService {
  private baseUrl = 'https://www.googleapis.com/calendar/v3';

  private async getAccessToken(): Promise<string | null> {
    const { session } = await getSession();
    return session?.provider_token || null;
  }

  async getCalendarEvents(): Promise<CalendarEvent[]> {
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      throw new Error('Not authenticated with Google');
    }

    const response = await fetch(`${this.baseUrl}/calendars/primary/events`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch calendar events');
    }

    const data = await response.json();
    return data.items;
  }
}

export const googleCalendarService = new GoogleCalendarService();
