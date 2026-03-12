import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Clock,
  BarChart3,
  Shield,
  MoreVertical,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Admin' | 'Manager' | 'Member' | 'Viewer';
  department: string;
  location: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  permissions: string[];
  stats: {
    tasksCompleted: number;
    hoursLogged: number;
    clientsManaged: number;
  };
  joinedDate: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Emma Clarke',
    email: 'emma@brunelarms.co.uk',
    phone: '+44 20 7946 0958',
    role: 'Admin',
    department: 'Operations',
    location: 'Bristol, UK',
    avatar: 'EC',
    status: 'online',
    permissions: ['All Modules', 'Billing', 'Settings', 'Team Management'],
    stats: { tasksCompleted: 142, hoursLogged: 168, clientsManaged: 12 },
    joinedDate: 'Jan 2024',
  },
  {
    id: '2',
    name: 'James Thornton',
    email: 'james@brunelarms.co.uk',
    phone: '+44 20 7946 1023',
    role: 'Manager',
    department: 'Client Services',
    location: 'London, UK',
    avatar: 'JT',
    status: 'online',
    permissions: ['Consul', 'Command', 'Reports'],
    stats: { tasksCompleted: 98, hoursLogged: 152, clientsManaged: 18 },
    joinedDate: 'Mar 2024',
  },
  {
    id: '3',
    name: 'Sarah Whitfield',
    email: 'sarah@brunelarms.co.uk',
    phone: '+44 161 496 0234',
    role: 'Manager',
    department: 'Memberships',
    location: 'Manchester, UK',
    avatar: 'SW',
    status: 'away',
    permissions: ['Lodge', 'Command', 'Reports'],
    stats: { tasksCompleted: 87, hoursLogged: 144, clientsManaged: 0 },
    joinedDate: 'Jun 2024',
  },
  {
    id: '4',
    name: "Liam O'Brien",
    email: 'liam@brunelarms.co.uk',
    phone: '+44 131 496 8721',
    role: 'Member',
    department: 'Memberships',
    location: 'Edinburgh, UK',
    avatar: 'LO',
    status: 'online',
    permissions: ['Lodge', 'Hearth'],
    stats: { tasksCompleted: 64, hoursLogged: 136, clientsManaged: 0 },
    joinedDate: 'Sep 2024',
  },
  {
    id: '5',
    name: 'Aroha Tane',
    email: 'aroha@brunelarms.co.nz',
    phone: '+64 9 887 4532',
    role: 'Member',
    department: 'Marketing',
    location: 'Auckland, NZ',
    avatar: 'AT',
    status: 'offline',
    permissions: ['Hearth', 'Lodge'],
    stats: { tasksCompleted: 53, hoursLogged: 128, clientsManaged: 0 },
    joinedDate: 'Nov 2024',
  },
  {
    id: '6',
    name: 'Marcus Chen',
    email: 'marcus@brunelarms.com.au',
    phone: '+61 2 9876 5432',
    role: 'Member',
    department: 'Loyalty',
    location: 'Sydney, AU',
    avatar: 'MC',
    status: 'online',
    permissions: ['Hearth'],
    stats: { tasksCompleted: 41, hoursLogged: 112, clientsManaged: 0 },
    joinedDate: 'Jan 2025',
  },
  {
    id: '7',
    name: 'Olivia Pearson',
    email: 'olivia@brunelarms.ca',
    phone: '+1 416 555 7890',
    role: 'Manager',
    department: 'Client Services',
    location: 'Toronto, CA',
    avatar: 'OP',
    status: 'away',
    permissions: ['Consul', 'Command', 'Reports'],
    stats: { tasksCompleted: 76, hoursLogged: 140, clientsManaged: 14 },
    joinedDate: 'Apr 2024',
  },
  {
    id: '8',
    name: 'Ben Harper',
    email: 'ben@brunelarms.co.uk',
    phone: '+44 117 496 3344',
    role: 'Viewer',
    department: 'Finance',
    location: 'Bristol, UK',
    avatar: 'BH',
    status: 'offline',
    permissions: ['Reports (read-only)'],
    stats: { tasksCompleted: 12, hoursLogged: 40, clientsManaged: 0 },
    joinedDate: 'Feb 2025',
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const roleColors: Record<TeamMember['role'], string> = {
  Admin: 'bg-purple-100 text-purple-700',
  Manager: 'bg-blue-100 text-blue-700',
  Member: 'bg-emerald-100 text-emerald-700',
  Viewer: 'bg-slate-100 text-slate-600',
};

const statusConfig: Record<TeamMember['status'], { color: string; label: string }> = {
  online: { color: 'bg-emerald-500', label: 'Online' },
  away: { color: 'bg-amber-400', label: 'Away' },
  offline: { color: 'bg-slate-300', label: 'Offline' },
};

const avatarColors = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-amber-500',
];

// ── Component ──────────────────────────────────────────────────────────────────

const Team: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('All');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const filteredMembers = teamMembers.filter((m) => {
    const matchSearch = !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === 'All' || m.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-command/10">
            <Users className="h-5 w-5 text-command" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink">Team</h1>
            <p className="text-sm text-ink-tertiary">{teamMembers.length} members across CANZUK regions</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-command px-4 py-2 text-sm font-medium text-white hover:bg-command-dark">
          <Plus className="h-4 w-4" /> Invite Member
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-command focus:outline-none focus:ring-1 focus:ring-command"
          />
        </div>
        <div className="flex gap-1">
          {['All', 'Admin', 'Manager', 'Member', 'Viewer'].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filterRole === role
                  ? 'bg-command text-white'
                  : 'bg-surface-tertiary text-ink-tertiary hover:text-ink-secondary'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Team Summary Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-ink-tertiary">Online Now</p>
          <p className="text-2xl font-bold text-emerald-600">
            {teamMembers.filter((m) => m.status === 'online').length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-ink-tertiary">Tasks This Week</p>
          <p className="text-2xl font-bold text-command">
            {teamMembers.reduce((sum, m) => sum + m.stats.tasksCompleted, 0)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-ink-tertiary">Total Hours (Month)</p>
          <p className="text-2xl font-bold text-ink">
            {teamMembers.reduce((sum, m) => sum + m.stats.hoursLogged, 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-ink-tertiary">Regions</p>
          <p className="text-2xl font-bold text-ink">4</p>
          <p className="text-[10px] text-ink-faint">UK, AU, CA, NZ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Team Member Cards */}
        <div className="space-y-4 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filteredMembers.map((member, idx) => {
              const isSelected = selectedMember?.id === member.id;
              return (
                <button
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className={`rounded-xl border bg-white p-5 text-left shadow-sm transition-all hover:shadow-md ${
                    isSelected ? 'border-command ring-1 ring-command' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white ${avatarColors[idx % avatarColors.length]}`}>
                          {member.avatar}
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${statusConfig[member.status].color}`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">{member.name}</p>
                        <p className="text-xs text-ink-tertiary">{member.department}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${roleColors[member.role]}`}>
                      {member.role}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 text-xs text-ink-faint">
                    <MapPin className="h-3 w-3" /> {member.location}
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-surface-secondary p-2.5">
                    <div className="text-center">
                      <p className="text-xs font-bold text-ink">{member.stats.tasksCompleted}</p>
                      <p className="text-[10px] text-ink-faint">Tasks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-ink">{member.stats.hoursLogged}h</p>
                      <p className="text-[10px] text-ink-faint">Hours</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-ink">{member.stats.clientsManaged}</p>
                      <p className="text-[10px] text-ink-faint">Clients</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail Sidebar */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          {selectedMember ? (
            <>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-base font-semibold text-ink">Member Details</h3>
                <button className="rounded p-1 text-ink-faint hover:bg-surface-tertiary">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-5 flex flex-col items-center">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold text-white ${avatarColors[teamMembers.findIndex((m) => m.id === selectedMember.id) % avatarColors.length]}`}>
                  {selectedMember.avatar}
                </div>
                <p className="mt-2 text-base font-semibold text-ink">{selectedMember.name}</p>
                <span className={`mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColors[selectedMember.role]}`}>
                  {selectedMember.role}
                </span>
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail className="h-4 w-4 text-ink-faint" />
                  <span className="text-ink-secondary">{selectedMember.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Phone className="h-4 w-4 text-ink-faint" />
                  <span className="text-ink-secondary">{selectedMember.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <MapPin className="h-4 w-4 text-ink-faint" />
                  <span className="text-ink-secondary">{selectedMember.location}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Clock className="h-4 w-4 text-ink-faint" />
                  <span className="text-ink-secondary">Joined {selectedMember.joinedDate}</span>
                </div>
              </div>

              {/* Permissions */}
              <div className="mt-5 border-t border-slate-100 pt-4">
                <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase text-ink-faint">
                  <Shield className="h-3.5 w-3.5" /> Permissions
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMember.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Activity Summary */}
              <div className="mt-5 border-t border-slate-100 pt-4">
                <h4 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase text-ink-faint">
                  <BarChart3 className="h-3.5 w-3.5" /> Activity Summary
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-ink-secondary">Tasks Completed</span>
                      <span className="font-medium text-ink">{selectedMember.stats.tasksCompleted}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-command"
                        style={{ width: `${Math.min(100, (selectedMember.stats.tasksCompleted / 150) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-ink-secondary">Hours Logged</span>
                      <span className="font-medium text-ink">{selectedMember.stats.hoursLogged}h</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${Math.min(100, (selectedMember.stats.hoursLogged / 176) * 100)}%` }}
                      />
                    </div>
                  </div>
                  {selectedMember.stats.clientsManaged > 0 && (
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-ink-secondary">Clients Managed</span>
                        <span className="font-medium text-ink">{selectedMember.stats.clientsManaged}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${Math.min(100, (selectedMember.stats.clientsManaged / 20) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-12 text-center">
              <Users className="mb-3 h-12 w-12 text-ink-faint/40" />
              <p className="text-sm font-medium text-ink-tertiary">Select a team member</p>
              <p className="mt-1 text-xs text-ink-faint">Click on a card to view their details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Team;
