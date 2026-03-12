import { useLocation } from 'react-router-dom';
import {
  Search,
  Bell,
  ChevronRight,
  Command,
  User,
  LogOut,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useAppStore } from '../../stores/appStore';

// ---------------------------------------------------------------------------
// Breadcrumb mapping
// ---------------------------------------------------------------------------

const moduleLabels: Record<string, string> = {
  command: 'Command',
  consul: 'Consul',
  hearth: 'Hearth',
  lodge: 'Lodge',
};

const pageLabels: Record<string, string> = {
  '': 'Dashboard',
  dashboard: 'Dashboard',
  calendar: 'Calendar',
  files: 'Files',
  wiki: 'Wiki',
  reports: 'Reports',
  workflows: 'Workflows',
  settings: 'Settings',
  team: 'Team',
  pipeline: 'Pipeline',
  clients: 'Clients',
  projects: 'Projects',
  invoices: 'Invoices',
  time: 'Time Tracking',
  proposals: 'Proposals',
  contracts: 'Contracts',
  loyalty: 'Loyalty',
  merchants: 'Merchants',
  campaigns: 'Campaigns',
  analytics: 'Analytics',
  payments: 'Payments',
  members: 'Members',
  types: 'Membership Types',
  events: 'Events',
  billing: 'Billing',
  communications: 'Communications',
  chapters: 'Chapters',
};

const moduleColors: Record<string, string> = {
  command: 'text-command',
  consul: 'text-consul',
  hearth: 'text-hearth',
  lodge: 'text-lodge',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TopBar() {
  const location = useLocation();
  const { setSearchOpen, unreadCount } = useAppStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Parse breadcrumbs
  const pathParts = location.pathname.split('/').filter(Boolean);
  const crumbs: { label: string; color?: string }[] = [];

  if (pathParts.length === 0) {
    crumbs.push({ label: 'Dashboard', color: moduleColors.command });
  } else {
    const mod = pathParts[0];
    if (moduleLabels[mod]) {
      crumbs.push({ label: moduleLabels[mod], color: moduleColors[mod] });
    }
    if (pathParts[1]) {
      crumbs.push({ label: pageLabels[pathParts[1]] || pathParts[1] });
    }
  }

  return (
    <header className="flex items-center h-14 px-4 bg-white border-b border-slate-200/60 flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 min-w-0">
        {crumbs.map((crumb, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-ink-faint" />}
            <span
              className={clsx(
                'text-sm font-medium truncate',
                idx === crumbs.length - 1
                  ? crumb.color || 'text-ink'
                  : 'text-ink-faint',
              )}
            >
              {crumb.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex-1" />

      {/* Search trigger */}
      <button
        onClick={() => setSearchOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-ink-faint bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors mr-2"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Search...</span>
        <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-white border border-slate-200 rounded ml-4">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </button>

      {/* Notifications */}
      <button className="relative p-2 rounded-lg text-ink-tertiary hover:text-ink-secondary hover:bg-slate-50 transition-colors mr-1">
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* User menu */}
      <div ref={userMenuRef} className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-forge-400 to-forge-600 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">JD</span>
          </div>
        </button>

        {userMenuOpen && (
          <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 animate-scale-in z-50">
            <div className="px-3 py-2 border-b border-slate-100 mb-1">
              <p className="text-sm font-medium text-ink">John Doe</p>
              <p className="text-xs text-ink-faint">john@canzuk.com</p>
            </div>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink-secondary hover:bg-slate-50 transition-colors">
              <User className="w-4 h-4" />
              Profile
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink-secondary hover:bg-slate-50 transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink-secondary hover:bg-slate-50 transition-colors">
              <HelpCircle className="w-4 h-4" />
              Help & Support
            </button>
            <div className="border-t border-slate-100 mt-1 pt-1">
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
