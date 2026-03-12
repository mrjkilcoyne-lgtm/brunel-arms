import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Clock,
  CalendarDays,
  Bookmark,
  Settings,
  Heart,
  Store,
  Megaphone,
  BarChart3,
  UserCheck,
  Tag,
  CalendarRange,
  CreditCard,
  Mail,
  GitBranch,
  Hash,
  ArrowRight,
} from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '../../stores/appStore';
import { api } from '../../lib/api';
import type { SearchResult } from '../../types';

// ---------------------------------------------------------------------------
// Quick actions
// ---------------------------------------------------------------------------

interface QuickAction {
  id: string;
  label: string;
  icon: typeof Search;
  path: string;
  module: string;
  keywords: string;
}

const quickActions: QuickAction[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/', module: 'command', keywords: 'home overview' },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays, path: '/command/calendar', module: 'command', keywords: 'dates schedule' },
  { id: 'files', label: 'Files', icon: FileText, path: '/command/files', module: 'command', keywords: 'documents' },
  { id: 'wiki', label: 'Wiki', icon: Bookmark, path: '/command/wiki', module: 'command', keywords: 'knowledge base docs' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/command/reports', module: 'command', keywords: 'analytics' },
  { id: 'workflows', label: 'Workflows', icon: GitBranch, path: '/command/workflows', module: 'command', keywords: 'automation' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/command/settings', module: 'command', keywords: 'preferences config' },
  { id: 'pipeline', label: 'Pipeline', icon: FolderKanban, path: '/consul/pipeline', module: 'consul', keywords: 'deals crm' },
  { id: 'clients', label: 'Clients', icon: Users, path: '/consul/clients', module: 'consul', keywords: 'contacts people' },
  { id: 'projects', label: 'Projects', icon: FolderKanban, path: '/consul/projects', module: 'consul', keywords: 'work' },
  { id: 'invoices', label: 'Invoices', icon: FileText, path: '/consul/invoices', module: 'consul', keywords: 'billing money' },
  { id: 'time', label: 'Time Tracking', icon: Clock, path: '/consul/time', module: 'consul', keywords: 'hours timesheet' },
  { id: 'proposals', label: 'Proposals', icon: FileText, path: '/consul/proposals', module: 'consul', keywords: 'quotes' },
  { id: 'contracts', label: 'Contracts', icon: FileText, path: '/consul/contracts', module: 'consul', keywords: 'agreements' },
  { id: 'loyalty', label: 'Loyalty', icon: Heart, path: '/hearth/loyalty', module: 'hearth', keywords: 'points rewards' },
  { id: 'merchants', label: 'Merchants', icon: Store, path: '/hearth/merchants', module: 'hearth', keywords: 'shops vendors' },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone, path: '/hearth/campaigns', module: 'hearth', keywords: 'marketing promotions' },
  { id: 'hearth-analytics', label: 'Analytics', icon: BarChart3, path: '/hearth/analytics', module: 'hearth', keywords: 'stats data' },
  { id: 'members', label: 'Members', icon: UserCheck, path: '/lodge/members', module: 'lodge', keywords: 'memberships' },
  { id: 'membership-types', label: 'Membership Types', icon: Tag, path: '/lodge/types', module: 'lodge', keywords: 'plans tiers' },
  { id: 'events', label: 'Events', icon: CalendarRange, path: '/lodge/events', module: 'lodge', keywords: 'meetings gatherings' },
  { id: 'lodge-billing', label: 'Billing', icon: CreditCard, path: '/lodge/billing', module: 'lodge', keywords: 'payments subscriptions' },
  { id: 'communications', label: 'Communications', icon: Mail, path: '/lodge/communications', module: 'lodge', keywords: 'email messages' },
  { id: 'chapters', label: 'Chapters', icon: Hash, path: '/lodge/chapters', module: 'lodge', keywords: 'groups regions' },
];

const moduleColors: Record<string, string> = {
  command: 'text-command',
  consul: 'text-consul',
  hearth: 'text-hearth',
  lodge: 'text-lodge',
};

const moduleBgColors: Record<string, string> = {
  command: 'bg-purple-50',
  consul: 'bg-blue-50',
  hearth: 'bg-orange-50',
  lodge: 'bg-green-50',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CommandPalette() {
  const { searchOpen, setSearchOpen } = useAppStore();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches] = useState<string[]>(['Acme Corp', 'INV-2026-002', 'Alice Morgan']);

  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setActiveIndex(0);
      setSearchResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const results = await api.search(query);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [query]);

  const filteredActions = query.trim()
    ? quickActions.filter(
        (a) =>
          a.label.toLowerCase().includes(query.toLowerCase()) ||
          a.keywords.toLowerCase().includes(query.toLowerCase()),
      )
    : quickActions.slice(0, 6);

  const allItems: { type: 'action' | 'result'; data: QuickAction | SearchResult }[] = [
    ...searchResults.map((r) => ({ type: 'result' as const, data: r })),
    ...filteredActions.map((a) => ({ type: 'action' as const, data: a })),
  ];

  const handleSelect = useCallback(
    (item: (typeof allItems)[number]) => {
      if (item.type === 'result') {
        navigate((item.data as SearchResult).url);
      } else {
        navigate((item.data as QuickAction).path);
      }
      setSearchOpen(false);
    },
    [navigate, setSearchOpen],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, allItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && allItems[activeIndex]) {
      e.preventDefault();
      handleSelect(allItems[activeIndex]);
    }
  };

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector(`[data-index="${activeIndex}"]`);
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!searchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      onClick={() => setSearchOpen(false)}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <Search className="w-5 h-5 text-ink-faint flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search everything or jump to..."
            className="flex-1 text-sm bg-transparent border-0 outline-none placeholder:text-ink-faint"
          />
          <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-ink-faint bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
          {/* Recent searches */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="px-3 mb-2">
              <p className="px-2 py-1.5 text-[10px] font-semibold text-ink-faint uppercase tracking-widest">
                Recent
              </p>
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-ink-secondary hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Clock className="w-3.5 h-3.5 text-ink-faint" />
                  {term}
                </button>
              ))}
            </div>
          )}

          {/* API search results */}
          {searchResults.length > 0 && (
            <div className="px-3 mb-2">
              <p className="px-2 py-1.5 text-[10px] font-semibold text-ink-faint uppercase tracking-widest">
                Results
              </p>
              {searchResults.map((result, idx) => (
                <button
                  key={result.id}
                  data-index={idx}
                  onClick={() => handleSelect({ type: 'result', data: result })}
                  className={clsx(
                    'w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors text-left',
                    activeIndex === idx ? 'bg-forge-50 text-forge-700' : 'hover:bg-slate-50',
                  )}
                >
                  <div
                    className={clsx(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      moduleBgColors[result.module],
                    )}
                  >
                    <Users className={clsx('w-4 h-4', moduleColors[result.module])} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{result.title}</p>
                    {result.subtitle && (
                      <p className="text-xs text-ink-faint truncate">{result.subtitle}</p>
                    )}
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-ink-faint flex-shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Quick actions */}
          <div className="px-3">
            <p className="px-2 py-1.5 text-[10px] font-semibold text-ink-faint uppercase tracking-widest">
              {query.trim() ? 'Go to' : 'Quick Actions'}
            </p>
            {filteredActions.length === 0 ? (
              <p className="px-2 py-4 text-sm text-ink-faint text-center">No matching actions</p>
            ) : (
              filteredActions.map((action, idx) => {
                const flatIdx = searchResults.length + idx;
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    data-index={flatIdx}
                    onClick={() => handleSelect({ type: 'action', data: action })}
                    className={clsx(
                      'w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors text-left',
                      activeIndex === flatIdx ? 'bg-forge-50 text-forge-700' : 'hover:bg-slate-50',
                    )}
                  >
                    <div
                      className={clsx(
                        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                        moduleBgColors[action.module],
                      )}
                    >
                      <Icon className={clsx('w-4 h-4', moduleColors[action.module])} />
                    </div>
                    <span className="flex-1 text-sm font-medium">{action.label}</span>
                    <span className="text-[10px] text-ink-faint capitalize">{action.module}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-slate-100 text-[10px] text-ink-faint">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-slate-100 rounded border border-slate-200 font-medium">&uarr;&darr;</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-slate-100 rounded border border-slate-200 font-medium">&crarr;</kbd>
            Open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-slate-100 rounded border border-slate-200 font-medium">esc</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
