import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Filter,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

type ViewMode = 'month' | 'week' | 'day';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date
  time: string;
  duration: string;
  module: 'Consul' | 'Lodge' | 'Hearth' | 'Command';
  location?: string;
  description?: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const mockEvents: CalendarEvent[] = [
  { id: '1', title: 'Q1 Revenue Review', date: '2026-03-02', time: '09:00', duration: '1h', module: 'Command', location: 'Board Room' },
  { id: '2', title: 'Barclays Quarterly Check-in', date: '2026-03-04', time: '10:30', duration: '45m', module: 'Consul', location: 'Zoom' },
  { id: '3', title: 'Gold Member Welcome Mixer', date: '2026-03-06', time: '18:00', duration: '2h', module: 'Lodge', location: 'The Atrium, Manchester' },
  { id: '4', title: 'Auckland Loyalty Launch', date: '2026-03-09', time: '14:00', duration: '1h', module: 'Hearth', location: 'Virtual' },
  { id: '5', title: 'Sprint Planning', date: '2026-03-10', time: '09:30', duration: '1.5h', module: 'Command' },
  { id: '6', title: 'ANZ Group Contract Renewal', date: '2026-03-12', time: '11:00', duration: '1h', module: 'Consul', location: 'Sydney Office' },
  { id: '7', title: 'Membership Tier Review', date: '2026-03-12', time: '14:00', duration: '45m', module: 'Lodge' },
  { id: '8', title: 'Loyalty Points Audit', date: '2026-03-13', time: '10:00', duration: '2h', module: 'Hearth' },
  { id: '9', title: 'Team Standup', date: '2026-03-12', time: '09:00', duration: '15m', module: 'Command' },
  { id: '10', title: 'Meridian Finance Onboarding', date: '2026-03-16', time: '13:00', duration: '1h', module: 'Consul', location: 'Toronto (Virtual)' },
  { id: '11', title: 'Monthly Newsletter Review', date: '2026-03-18', time: '15:00', duration: '30m', module: 'Hearth' },
  { id: '12', title: 'Wellington Member Event Planning', date: '2026-03-20', time: '11:00', duration: '1h', module: 'Lodge', location: 'Wellington Office' },
  { id: '13', title: 'End of Month Reporting', date: '2026-03-30', time: '09:00', duration: '3h', module: 'Command' },
  { id: '14', title: 'Campaign Performance Review', date: '2026-03-25', time: '14:30', duration: '1h', module: 'Hearth' },
  { id: '15', title: 'New Client Proposal: TD Bank', date: '2026-03-22', time: '10:00', duration: '1h', module: 'Consul', location: 'Ottawa Office' },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const moduleColors: Record<CalendarEvent['module'], { bg: string; text: string; dot: string; badge: string }> = {
  Consul: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700' },
  Lodge: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
  Hearth: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700' },
  Command: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700' },
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// ── Component ──────────────────────────────────────────────────────────────────

const Calendar: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(2); // March (0-indexed)
  const [selectedDate, setSelectedDate] = useState('2026-03-12');

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const today = '2026-03-12';

  const eventsByDate = mockEvents.reduce<Record<string, CalendarEvent[]>>((acc, evt) => {
    if (!acc[evt.date]) acc[evt.date] = [];
    acc[evt.date].push(evt);
    return acc;
  }, {});

  const selectedEvents = eventsByDate[selectedDate] || [];

  const navigateMonth = (direction: -1 | 1) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    if (newMonth > 11) { newMonth = 0; newYear++; }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // Build calendar grid cells
  const calendarCells: Array<{ day: number; dateKey: string } | null> = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({ day: d, dateKey: formatDateKey(currentYear, currentMonth, d) });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-command/10">
            <CalendarIcon className="h-5 w-5 text-command" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink">Calendar</h1>
            <p className="text-sm text-ink-tertiary">Unified view across all modules</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-ink-secondary hover:bg-surface-tertiary">
            <Filter className="h-4 w-4" /> Filter
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-command px-4 py-1.5 text-sm font-medium text-white hover:bg-command-dark">
            <Plus className="h-4 w-4" /> New Event
          </button>
        </div>
      </div>

      {/* View toggle & navigation */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={() => navigateMonth(-1)} className="rounded-lg p-1.5 hover:bg-surface-tertiary">
            <ChevronLeft className="h-5 w-5 text-ink-secondary" />
          </button>
          <h2 className="min-w-[180px] text-center text-lg font-semibold text-ink">
            {MONTHS[currentMonth]} {currentYear}
          </h2>
          <button onClick={() => navigateMonth(1)} className="rounded-lg p-1.5 hover:bg-surface-tertiary">
            <ChevronRight className="h-5 w-5 text-ink-secondary" />
          </button>
        </div>
        <div className="flex rounded-lg border border-slate-200">
          {(['month', 'week', 'day'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-1.5 text-sm font-medium capitalize transition-colors first:rounded-l-lg last:rounded-r-lg ${
                viewMode === mode ? 'bg-command text-white' : 'text-ink-secondary hover:bg-surface-tertiary'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar + Sidebar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Calendar Grid */}
        <div className="col-span-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-3">
          {/* Day headers */}
          <div className="mb-2 grid grid-cols-7 gap-1">
            {DAYS.map((d) => (
              <div key={d} className="py-2 text-center text-xs font-semibold uppercase text-ink-faint">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((cell, idx) => {
              if (!cell) {
                return <div key={`empty-${idx}`} className="h-24 rounded-lg bg-surface-secondary/50" />;
              }
              const { day, dateKey } = cell;
              const isToday = dateKey === today;
              const isSelected = dateKey === selectedDate;
              const dayEvents = eventsByDate[dateKey] || [];

              return (
                <button
                  key={dateKey}
                  onClick={() => setSelectedDate(dateKey)}
                  className={`flex h-24 flex-col rounded-lg border p-1.5 text-left transition-colors ${
                    isSelected
                      ? 'border-command bg-command/5'
                      : isToday
                        ? 'border-purple-200 bg-purple-50/50'
                        : 'border-transparent hover:border-slate-200 hover:bg-surface-secondary'
                  }`}
                >
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                      isToday ? 'bg-command text-white' : 'text-ink-secondary'
                    }`}
                  >
                    {day}
                  </span>
                  <div className="mt-0.5 flex flex-1 flex-col gap-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map((evt) => (
                      <div
                        key={evt.id}
                        className={`truncate rounded px-1 py-0.5 text-[10px] font-medium ${moduleColors[evt.module].bg} ${moduleColors[evt.module].text}`}
                      >
                        {evt.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[10px] text-ink-faint">+{dayEvents.length - 2} more</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Event Sidebar */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-1 text-sm font-semibold text-ink">
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </h3>
          <p className="mb-4 text-xs text-ink-faint">
            {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''}
          </p>

          {selectedEvents.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CalendarIcon className="mb-2 h-10 w-10 text-ink-faint/50" />
              <p className="text-sm text-ink-tertiary">No events scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedEvents.map((evt) => {
                const colors = moduleColors[evt.module];
                return (
                  <div key={evt.id} className={`rounded-lg border p-3 ${colors.bg} border-transparent`}>
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className={`inline-block h-2 w-2 rounded-full ${colors.dot}`} />
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${colors.badge}`}>
                        {evt.module}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-ink">{evt.title}</p>
                    <div className="mt-2 space-y-1">
                      <p className="flex items-center gap-1.5 text-xs text-ink-secondary">
                        <Clock className="h-3 w-3" /> {evt.time} ({evt.duration})
                      </p>
                      {evt.location && (
                        <p className="flex items-center gap-1.5 text-xs text-ink-secondary">
                          <MapPin className="h-3 w-3" /> {evt.location}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Module Legend */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase text-ink-faint">Modules</p>
            <div className="space-y-1.5">
              {(Object.keys(moduleColors) as CalendarEvent['module'][]).map((mod) => (
                <div key={mod} className="flex items-center gap-2 text-xs text-ink-secondary">
                  <span className={`h-2.5 w-2.5 rounded-full ${moduleColors[mod].dot}`} />
                  {mod}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
