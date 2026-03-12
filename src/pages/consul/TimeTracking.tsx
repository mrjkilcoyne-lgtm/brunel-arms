import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronRight,
  Play,
  Square,
  Plus,
  Clock,
  TrendingUp,
  Zap,
  Target,
  ChevronLeft,
  ChevronRightIcon,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TimeEntry {
  id: string;
  project: string;
  task: string;
  hours: number;
  billable: boolean;
  date: string;
  description: string;
}

interface WeekDay {
  label: string;
  date: string;
  isToday: boolean;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const projects = [
  'Digital Transformation Strategy',
  'Supply Chain Optimisation',
  'Cloud Migration Assessment',
  'DevOps Maturity Assessment',
  'Risk & Compliance Review',
];

const todayEntries: TimeEntry[] = [
  { id: '1', project: 'Digital Transformation Strategy', task: 'Stakeholder interviews', hours: 2.5, billable: true, date: '2026-03-12', description: 'Interviewed 3 senior stakeholders on current pain points' },
  { id: '2', project: 'Supply Chain Optimisation', task: 'Data analysis', hours: 1.75, billable: true, date: '2026-03-12', description: 'Analysed Q4 logistics data for bottleneck identification' },
  { id: '3', project: 'Cloud Migration Assessment', task: 'Architecture review', hours: 1.0, billable: true, date: '2026-03-12', description: 'Reviewed current infrastructure diagrams with CTO' },
  { id: '4', project: 'Risk & Compliance Review', task: 'Internal meeting', hours: 0.5, billable: false, date: '2026-03-12', description: 'Team sync on compliance framework approach' },
];

const weekDays: WeekDay[] = [
  { label: 'Mon', date: '09 Mar', isToday: false },
  { label: 'Tue', date: '10 Mar', isToday: false },
  { label: 'Wed', date: '11 Mar', isToday: false },
  { label: 'Thu', date: '12 Mar', isToday: true },
  { label: 'Fri', date: '13 Mar', isToday: false },
  { label: 'Sat', date: '14 Mar', isToday: false },
  { label: 'Sun', date: '15 Mar', isToday: false },
];

// Hours logged per project per day (Mon-Sun)
const weeklyData: { project: string; hours: number[] }[] = [
  { project: 'Digital Transformation Strategy', hours: [3.0, 2.0, 4.0, 2.5, 0, 0, 0] },
  { project: 'Supply Chain Optimisation', hours: [2.0, 3.0, 1.5, 1.75, 0, 0, 0] },
  { project: 'Cloud Migration Assessment', hours: [0, 1.5, 0, 1.0, 0, 0, 0] },
  { project: 'DevOps Maturity Assessment', hours: [1.0, 0, 1.5, 0, 0, 0, 0] },
  { project: 'Risk & Compliance Review', hours: [1.5, 1.0, 0.5, 0.5, 0, 0, 0] },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const TimeTracking: React.FC = () => {
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [timerDescription, setTimerDescription] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Manual entry form state
  const [manualProject, setManualProject] = useState(projects[0]);
  const [manualHours, setManualHours] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [manualBillable, setManualBillable] = useState(true);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning]);

  const formatTimer = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Stats
  const totalHoursThisWeek = weeklyData.reduce((sum, row) => sum + row.hours.reduce((a, b) => a + b, 0), 0);
  const billableHoursThisWeek = todayEntries.filter((e) => e.billable).reduce((s, e) => s + e.hours, 0) + 22; // approximate
  const billablePercent = Math.round((billableHoursThisWeek / totalHoursThisWeek) * 100);
  const utilizationRate = Math.round((totalHoursThisWeek / 40) * 100);

  return (
    <div className="flex flex-col h-full bg-surface-secondary">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-slate-200 bg-white">
        <div className="flex items-center text-sm text-ink-tertiary mb-1">
          <span>Consul</span>
          <ChevronRight className="w-3.5 h-3.5 mx-1" />
          <span className="text-ink-secondary font-medium">Time Tracking</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-ink mt-1">Time Tracking</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-5 space-y-6">
          {/* Active Timer */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-consul" />
              Active Timer
            </h2>
            <div className="flex items-center gap-4">
              <div
                className={`text-3xl font-mono font-bold tracking-wider ${timerRunning ? 'text-consul' : 'text-ink-tertiary'}`}
              >
                {formatTimer(timerSeconds)}
              </div>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`p-3 rounded-full shadow-sm transition-colors ${
                  timerRunning
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-consul hover:bg-consul-dark text-white'
                }`}
              >
                {timerRunning ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-consul/30 focus:border-consul text-ink-secondary bg-white flex-1 max-w-xs"
              >
                {projects.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="What are you working on?"
                value={timerDescription}
                onChange={(e) => setTimerDescription(e.target.value)}
                className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-consul/30 focus:border-consul"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
                <Clock className="w-3.5 h-3.5" />
                Hours This Week
              </div>
              <p className="text-2xl font-bold text-ink mt-1">{totalHoursThisWeek.toFixed(1)}</p>
              <p className="text-xs text-ink-faint mt-0.5">of 40h target</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
                <TrendingUp className="w-3.5 h-3.5" />
                Billable %
              </div>
              <p className="text-2xl font-bold text-consul mt-1">{billablePercent}%</p>
              <p className="text-xs text-ink-faint mt-0.5">{billableHoursThisWeek.toFixed(1)}h billable</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
                <Target className="w-3.5 h-3.5" />
                Utilisation
              </div>
              <p className="text-2xl font-bold text-ink mt-1">{utilizationRate}%</p>
              <p className="text-xs text-ink-faint mt-0.5">target: 80%</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
                <Zap className="w-3.5 h-3.5" />
                Today
              </div>
              <p className="text-2xl font-bold text-ink mt-1">
                {todayEntries.reduce((s, e) => s + e.hours, 0).toFixed(2)}h
              </p>
              <p className="text-xs text-ink-faint mt-0.5">{todayEntries.length} entries</p>
            </div>
          </div>

          {/* Weekly Timesheet Grid */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-ink">Weekly Timesheet</h2>
              <div className="flex items-center gap-2 text-sm text-ink-secondary">
                <button className="p-1 rounded hover:bg-slate-100">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-medium">9 Mar - 15 Mar 2026</span>
                <button className="p-1 rounded hover:bg-slate-100">
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-5 py-2.5 w-64">
                    Project
                  </th>
                  {weekDays.map((day) => (
                    <th
                      key={day.label}
                      className={`text-center text-xs font-medium uppercase tracking-wide px-2 py-2.5 w-20 ${
                        day.isToday ? 'text-consul bg-blue-50/50' : 'text-ink-tertiary'
                      }`}
                    >
                      <div>{day.label}</div>
                      <div className="text-[10px] font-normal mt-0.5">{day.date}</div>
                    </th>
                  ))}
                  <th className="text-center text-xs font-medium text-ink-tertiary uppercase tracking-wide px-3 py-2.5 w-20">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {weeklyData.map((row) => {
                  const rowTotal = row.hours.reduce((a, b) => a + b, 0);
                  return (
                    <tr key={row.project} className="hover:bg-slate-50/50">
                      <td className="px-5 py-2.5 text-sm text-ink-secondary truncate max-w-[256px]">
                        {row.project}
                      </td>
                      {row.hours.map((h, i) => (
                        <td
                          key={i}
                          className={`text-center text-sm px-2 py-2.5 ${
                            weekDays[i].isToday ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          {h > 0 ? (
                            <span className="font-medium text-ink">{h.toFixed(h % 1 === 0 ? 0 : 1)}</span>
                          ) : (
                            <span className="text-ink-faint">-</span>
                          )}
                        </td>
                      ))}
                      <td className="text-center text-sm font-semibold text-ink px-3 py-2.5">
                        {rowTotal.toFixed(rowTotal % 1 === 0 ? 0 : 1)}
                      </td>
                    </tr>
                  );
                })}
                {/* Totals row */}
                <tr className="bg-slate-50 font-semibold">
                  <td className="px-5 py-2.5 text-sm text-ink">Daily Total</td>
                  {weekDays.map((day, i) => {
                    const dayTotal = weeklyData.reduce((s, r) => s + r.hours[i], 0);
                    return (
                      <td
                        key={day.label}
                        className={`text-center text-sm px-2 py-2.5 ${day.isToday ? 'text-consul' : 'text-ink'}`}
                      >
                        {dayTotal > 0 ? dayTotal.toFixed(dayTotal % 1 === 0 ? 0 : 1) : '-'}
                      </td>
                    );
                  })}
                  <td className="text-center text-sm font-bold text-consul px-3 py-2.5">
                    {totalHoursThisWeek.toFixed(1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Today's Entries */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-ink">Today's Entries</h2>
                <span className="text-xs text-ink-tertiary">{todayEntries.length} entries</span>
              </div>
              <div className="divide-y divide-slate-50">
                {todayEntries.map((entry) => (
                  <div key={entry.id} className="px-5 py-3 hover:bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-ink">{entry.task}</p>
                      <div className="flex items-center gap-2">
                        {entry.billable && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-medium">
                            Billable
                          </span>
                        )}
                        <span className="text-sm font-semibold text-ink">{entry.hours}h</span>
                      </div>
                    </div>
                    <p className="text-xs text-ink-tertiary mt-0.5">{entry.project}</p>
                    <p className="text-xs text-ink-faint mt-1">{entry.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Entry Form */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="px-5 py-3 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
                  <Plus className="w-4 h-4 text-consul" />
                  Manual Entry
                </h2>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-ink-tertiary mb-1">Project</label>
                  <select
                    value={manualProject}
                    onChange={(e) => setManualProject(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-consul/30 focus:border-consul text-ink-secondary bg-white"
                  >
                    {projects.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-ink-tertiary mb-1">Hours</label>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="24"
                      placeholder="0.00"
                      value={manualHours}
                      onChange={(e) => setManualHours(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-consul/30 focus:border-consul"
                    />
                  </div>
                  <div className="flex items-end pb-0.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={manualBillable}
                        onChange={(e) => setManualBillable(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-consul focus:ring-consul/30"
                      />
                      <span className="text-sm text-ink-secondary">Billable</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-tertiary mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe what you worked on..."
                    value={manualDescription}
                    onChange={(e) => setManualDescription(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-consul/30 focus:border-consul resize-none"
                  />
                </div>
                <button className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-sm bg-consul text-white rounded-lg hover:bg-consul-dark font-medium shadow-sm">
                  <Plus className="w-4 h-4" />
                  Add Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTracking;
