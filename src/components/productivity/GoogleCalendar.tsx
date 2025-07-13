import React, { useEffect, useState } from 'react';
import { googleCalendarService } from '../../services/googleCalendarService';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Calendar, Clock } from 'lucide-react';

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

const GoogleCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const calendarEvents = await googleCalendarService.getCalendarEvents();
        setEvents(calendarEvents);
      } catch (err) {
        setError('Failed to fetch calendar events. Please try reconnecting your Google account.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return <div>Loading calendar...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-white flex items-center">
          <Calendar className="mr-2" />
          Google Calendar
        </h2>
      </CardHeader>
      <CardBody>
        {events.length === 0 ? (
          <p>No upcoming events.</p>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => (
              <li key={event.id} className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-white">{event.summary}</h3>
                <p className="text-sm text-gray-400 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {new Date(event.start.dateTime).toLocaleString()} - {new Date(event.end.dateTime).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
};

export default GoogleCalendar;
