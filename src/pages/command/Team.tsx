import React, { useState } from 'react';
import {
  Users,
  ChevronRight,
  Plus,
  Search,
  ShieldCheck,
  PenLine,
  Eye,
  MoreHorizontal,
  Mail,
  Clock,
  MapPin,
  Crown,
  UserCheck,
  Settings,
  Activity,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Role = 'owner' | 'admin' | 'editor' | 'viewer';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  location: string;
  department: string;
  lastActive: string;
  joinedDate: string;
  status: 'online' | 'away' | 'offline';
  modules: string[];
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Eleanor Whitfield',
    email: 'eleanor@canzuk.com',
    role: 'owner',
    avatar: 'EW',
    location: 'London, UK',
    department: 'Executive',
    lastActive: 'Now',
    joinedDate: 'Jan 2024',
    status: 'online',
    modules: ['Command', 'Consul', 'Lodge', 'Hearth'],
  },
  {
    id: '2',
    name: 'James Thornton',
    email: 'james.t@canzuk.com',
    role: 'admin',
    avatar: 'JT',
    location: 'Melbourne, AU',
    department: 'Operations',
    lastActive: '5 min ago',
    joinedDate: 'Mar 2024',
    status: 'online',
    modules: ['Command', 'Consul', 'Lodge'],
  },
  {
    id: '3',
    name: 'Priya Nair',
    email: 'priya.n@canzuk.com',
    role: 'admin',
    avatar: 'PN',
    location: 'Toronto, CA',
    department: 'Consulting',
    lastActive: '2 hours ago',
    joinedDate: 'Jun 2024',
    status: 'away',
    modules: ['Consul', 'Command'],
  },
  {
    id: '4',
    name: 'Marcus Chen',
    email: 'marcus.c@canzuk.com',
    role: 'editor',
    avatar: 'MC',
    location: 'Auckland, NZ',
    department: 'Loyalty & Marketing',
    lastActive: '1 day ago',
    joinedDate: 'Sep 2024',
    status: 'offline',
    modules: ['Hearth', 'Lodge'],
  },
  {
    id: '5',
    name: 'Sophie Beaumont',
    email: 'sophie.b@canzuk.com',
    role: 'editor',
    avatar: 'SB',
    location: 'London, UK',
    department: 'Finance',
    lastActive: '30 min ago',
    joinedDate: 'Nov 2024',
    status: 'online',
    modules: ['Consul', 'Command'],
  },
  {
    id: '6',
    name: 'David Tremblay',
    email: 'david.t@canzuk.com',
    role: 'viewer',
    avatar: 'DT',
    location: 'Singapore',
    department: 'Business Development',
    lastActive: '3 days ago',
    joinedDate: 'Jan 2025',
    status: 'offline',
    modules: ['Consul'],
  },
];

const roleConfig: Record<Role, { label: string; icon: React.ElementType; bg: string; text: string }> = {
  owner: { label: 'Owner', icon: Crown, bg: 'bg-purple-50', text: 'text-purple-700' },
  admin: { label: 'Admin', icon: ShieldCheck, bg: 'bg-blue-50', text: 'text-blue-700' },
  editor: { label: 'Editor', icon: PenLine, bg: 'bg-emerald-50', text: 'text-emerald-700' },
  viewer: { label: 'Viewer', icon: Eye, bg: 'bg-slate-100', text: 'text-slate-600' },
};

const statusColors: Record<string, string> = {
  online: 'bg-emerald-500',
  away: 'bg-amber-400',
  offline: 'bg-slate-300',
};

const moduleColors: Record<string, string> = {
  Command: 'bg-purple-50 text-purple-700',
  Consul: 'bg-blue-50 text-blue-700',
  Lodge: 'bg-emerald-50 text-emerald-700',
  Hearth: 'bg-orange-50 text-orange-700',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Team: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | Role>('all');

  const filteredMembers = mockTeamMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || m.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const onlineCount = mockTeamMembers.filter((m) => m.status === 'online').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center text-sm text-ink-tertiary mb-1">
        <span>Command</span>
        <ChevronRight className="w-3.5 h-3.5 mx-1" />
        <span className="text-ink-secondary font-medium">Team</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-command/10">
            <Users className="h-5 w-5 text-command" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink">Team Management</h1>
            <p className="text-sm text-ink-tertiary">
              {mockTeamMembers.length} members &middot; {onlineCount} online now
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 text-ink-secondary">
            <Settings className="w-4 h-4" />
            Roles &amp; Permissions
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm bg-command text-white rounded-lg hover:bg-command-dark font-medium shadow-sm">
            <Plus className="w-4 h-4" />
            Invite Member
          </button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
            <Users className="w-3.5 h-3.5" />
            Total Members
          </div>
          <p className="text-2xl font-bold text-ink mt-1">{mockTeamMembers.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
            <Activity className="w-3.5 h-3.5" />
            Online Now
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{onlineCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admins
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {mockTeamMembers.filter((m) => m.role === 'admin' || m.role === 'owner').length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
            <MapPin className="w-3.5 h-3.5" />
            Locations
          </div>
          <p className="text-2xl font-bold text-ink mt-1">
            {new Set(mockTeamMembers.map((m) => m.location)).size}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-command/30 focus:border-command"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1">
          {(['all', 'owner', 'admin', 'editor', 'viewer'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                filterRole === role
                  ? 'bg-command text-white'
                  : 'text-ink-tertiary hover:bg-surface-tertiary'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Team Member Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => {
          const roleStyle = roleConfig[member.role];
          const RoleIcon = roleStyle.icon;

          return (
            <div
              key={member.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-command/10 text-command font-semibold text-sm">
                      {member.avatar}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${statusColors[member.status]}`}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">{member.name}</h3>
                    <p className="text-xs text-ink-tertiary">{member.department}</p>
                  </div>
                </div>
                <button className="text-ink-faint hover:text-ink-secondary transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Role Badge */}
              <div className="mt-4 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${roleStyle.bg} ${roleStyle.text}`}>
                  <RoleIcon className="w-3 h-3" />
                  {roleStyle.label}
                </span>
              </div>

              {/* Details */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-ink-tertiary">
                  <Mail className="w-3.5 h-3.5" />
                  {member.email}
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-tertiary">
                  <MapPin className="w-3.5 h-3.5" />
                  {member.location}
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-tertiary">
                  <Clock className="w-3.5 h-3.5" />
                  Last active: {member.lastActive}
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-tertiary">
                  <UserCheck className="w-3.5 h-3.5" />
                  Joined {member.joinedDate}
                </div>
              </div>

              {/* Module Access */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-[10px] font-medium text-ink-faint uppercase tracking-wide mb-2">Module Access</p>
                <div className="flex flex-wrap gap-1.5">
                  {member.modules.map((mod) => (
                    <span
                      key={mod}
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${moduleColors[mod]}`}
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Team;
