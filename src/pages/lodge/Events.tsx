import React, { useState, useMemo } from 'react';
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  Clock,
  Ticket,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Video,
  Filter,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
type TicketType = 'free' | 'paid' | 'members-only';

interface LodgeEventItem {
  id: string;
  title: string;
  description: string;
  date: string; // ISO
  endDate: string;
  location: string;
  virtual?: boolean;
  virtualUrl?: string;
  capacity: number;
  registered: number;
  ticketType: TicketType;
  ticketPrice?: number;
  status: EventStatus;
  chapter: string;
  tags: string[];
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_EVENTS: LodgeEventItem[] = [
  {
    id: '1',
    title: 'Monthly Members Meetup — London',
    description: 'Informal networking evening with guest speaker on CANZUK trade policy.',
    date: '2026-03-25T18:30:00',
    endDate: '2026-03-25T21:00:00',
    location: 'The Brunel Room, Paddington, London',
    capacity: 60,
    registered: 43,
    ticketType: 'members-only',
    status: 'upcoming',
    chapter: 'London HQ',
    tags: ['Networking', 'Monthly'],
  },
  {
    id: '2',
    title: 'CANZUK Annual Conference 2026',
    description: 'Three-day flagship conference featuring keynotes, workshops, and the Annual General Meeting.',
    date: '2026-06-12T09:00:00',
    endDate: '2026-06-14T17:00:00',
    location: 'QEII Centre, Westminster, London',
    capacity: 500,
    registered: 287,
    ticketType: 'paid',
    ticketPrice: 195,
    status: 'upcoming',
    chapter: 'London HQ',
    tags: ['Conference', 'AGM', 'Flagship'],
  },
  {
    id: '3',
    title: 'Digital Marketing Workshop',
    description: 'Hands-on workshop for chapters on growing membership through social media.',
    date: '2026-04-08T10:00:00',
    endDate: '2026-04-08T16:00:00',
    location: 'Online',
    virtual: true,
    virtualUrl: 'https://meet.forge.app/workshop-apr',
    capacity: 100,
    registered: 72,
    ticketType: 'free',
    status: 'upcoming',
    chapter: 'All Chapters',
    tags: ['Workshop', 'Virtual'],
  },
  {
    id: '4',
    title: 'Melbourne Networking Dinner',
    description: 'Quarterly dinner for Melbourne chapter members and prospective guests.',
    date: '2026-04-18T19:00:00',
    endDate: '2026-04-18T22:30:00',
    location: 'The Windsor Hotel, Melbourne',
    capacity: 40,
    registered: 38,
    ticketType: 'paid',
    ticketPrice: 75,
    status: 'upcoming',
    chapter: 'Melbourne',
    tags: ['Dinner', 'Networking'],
  },
  {
    id: '5',
    title: 'New Member Orientation — Q1',
    description: 'Welcome session for members who joined in Q1 2026.',
    date: '2026-03-10T12:00:00',
    endDate: '2026-03-10T13:30:00',
    location: 'Online',
    virtual: true,
    capacity: 30,
    registered: 18,
    ticketType: 'members-only',
    status: 'completed',
    chapter: 'All Chapters',
    tags: ['Orientation', 'Virtual'],
  },
  {
    id: '6',
    title: 'Toronto Community Clean-Up Day',
    description: 'Annual community service event. All members and families welcome.',
    date: '2026-02-15T09:00:00',
    endDate: '2026-02-15T14:00:00',
    location: 'High Park, Toronto',
    capacity: 80,
    registered: 55,
    ticketType: 'free',
    status: 'completed',
    chapter: 'Toronto',
    tags: ['Community', 'Volunteer'],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' at ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

const capacityPercent = (r: number, c: number) => Math.round((r / c) * 100);

const ticketBadge = (t: TicketType, price?: number) => {
  const map: Record<TicketType, { bg: string; text: string; label: string }> = {
    free: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Free' },
    paid: { bg: 'bg-amber-50', text: 'text-amber-700', label: price ? `\u00A3${price}` : 'Paid' },
    'members-only': { bg: 'bg-violet-50', text: 'text-violet-700', label: 'Members Only' },
  };
  const s = map[t];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>{s.label}</span>;
};

const statusBadge = (status: EventStatus) => {
  const map: Record<EventStatus, { bg: string; text: string; label: string }> = {
    upcoming: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Upcoming' },
    ongoing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Ongoing' },
    completed: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Completed' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
  };
  const s = map[status];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>{s.label}</span>;
};

// ---------------------------------------------------------------------------
// Mini calendar
// ---------------------------------------------------------------------------

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const MiniCalendar: React.FC<{ eventDates: Set<string> }> = ({ eventDates }) => {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const startDay = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7; // Mon=0
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const cells: (number | null)[] = Array(startDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prev = () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  const next = () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));

  const monthLabel = month.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-sm font-semibold text-gray-900">{monthLabel}</p>
        <button onClick={next} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS.map((d) => (
          <div key={d} className="text-[10px] font-medium text-gray-400 py-1">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const dateStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = dateStr === todayStr;
          const hasEvent = eventDates.has(dateStr);
          return (
            <div
              key={i}
              className={`relative flex h-7 w-7 items-center justify-center rounded-full text-xs mx-auto ${
                isToday ? 'bg-emerald-600 font-bold text-white' : 'text-gray-700'
              } ${hasEvent && !isToday ? 'font-semibold' : ''}`}
            >
              {day}
              {hasEvent && (
                <span className={`absolute bottom-0.5 h-1 w-1 rounded-full ${isToday ? 'bg-white' : 'bg-emerald-500'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const Events: React.FC = () => {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcoming = useMemo(() => MOCK_EVENTS.filter((e) => e.status === 'upcoming' || e.status === 'ongoing'), []);
  const past = useMemo(() => MOCK_EVENTS.filter((e) => e.status === 'completed' || e.status === 'cancelled'), []);
  const displayed = tab === 'upcoming' ? upcoming : past;

  const eventDates = useMemo(() => {
    const s = new Set<string>();
    MOCK_EVENTS.forEach((e) => {
      const d = new Date(e.date);
      s.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
    });
    return s;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="mt-1 text-sm text-gray-500">Manage meetups, conferences, and workshops</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        {/* Left — Event list */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex items-center gap-4 border-b border-gray-200">
            {(['upcoming', 'past'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-2.5 text-sm font-medium capitalize transition-colors ${
                  tab === t
                    ? 'border-b-2 border-emerald-600 text-emerald-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t} ({t === 'upcoming' ? upcoming.length : past.length})
              </button>
            ))}
          </div>

          {/* Cards */}
          {displayed.map((e) => {
            const pct = capacityPercent(e.registered, e.capacity);
            return (
              <div key={e.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-gray-900">{e.title}</h3>
                      {statusBadge(e.status)}
                      {ticketBadge(e.ticketType, e.ticketPrice)}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{e.description}</p>
                  </div>
                  {/* Date block */}
                  <div className="flex-shrink-0 text-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                    <p className="text-xs font-medium uppercase text-emerald-600">
                      {new Date(e.date).toLocaleDateString('en-GB', { month: 'short' })}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Date(e.date).getDate()}
                    </p>
                  </div>
                </div>

                {/* Meta */}
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDateTime(e.date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    {e.virtual ? <Video className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                    {e.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {e.registered} / {e.capacity} registered
                  </span>
                </div>

                {/* Capacity bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Capacity</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Tags */}
                {e.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {e.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {displayed.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-500">No events to display.</div>
          )}
        </div>

        {/* Right sidebar — Calendar */}
        <div className="space-y-4">
          <MiniCalendar eventDates={eventDates} />

          {/* Quick upcoming list */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Next Up</h4>
            <ul className="space-y-3">
              {upcoming.slice(0, 3).map((e) => (
                <li key={e.id} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{e.title}</p>
                    <p className="text-xs text-gray-500">{formatShortDate(e.date)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
