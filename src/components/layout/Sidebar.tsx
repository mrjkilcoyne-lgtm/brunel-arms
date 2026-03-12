import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  Bookmark,
  BarChart3,
  GitBranch,
  Settings,
  FolderKanban,
  Users,
  Clock,
  FileSignature,
  ScrollText,
  Heart,
  Store,
  Megaphone,
  UserCheck,
  Tag,
  CalendarRange,
  CreditCard,
  Mail,
  Hash,
  ChevronsLeft,
  ChevronsRight,
  Flame,
  CircleDollarSign,
  type LucideIcon,
} from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '../../stores/appStore';

// ---------------------------------------------------------------------------
// Navigation structure
// ---------------------------------------------------------------------------

interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

interface NavSection {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  textColor: string;
  activeColor: string;
  activeBg: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    id: 'command',
    label: 'Command',
    icon: LayoutDashboard,
    color: 'text-command',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-command',
    activeColor: 'text-command-dark',
    activeBg: 'bg-purple-50',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { label: 'Calendar', icon: CalendarDays, path: '/command/calendar' },
      { label: 'Files', icon: FileText, path: '/command/files' },
      { label: 'Wiki', icon: Bookmark, path: '/command/wiki' },
      { label: 'Reports', icon: BarChart3, path: '/command/reports' },
      { label: 'Workflows', icon: GitBranch, path: '/command/workflows' },
      { label: 'Settings', icon: Settings, path: '/command/settings' },
    ],
  },
  {
    id: 'consul',
    label: 'Consul',
    icon: Users,
    color: 'text-consul',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-consul',
    activeColor: 'text-consul-dark',
    activeBg: 'bg-blue-50',
    items: [
      { label: 'Pipeline', icon: FolderKanban, path: '/consul/pipeline' },
      { label: 'Clients', icon: Users, path: '/consul/clients' },
      { label: 'Projects', icon: FolderKanban, path: '/consul/projects' },
      { label: 'Invoices', icon: FileText, path: '/consul/invoices' },
      { label: 'Time Tracking', icon: Clock, path: '/consul/time' },
      { label: 'Proposals', icon: FileSignature, path: '/consul/proposals' },
      { label: 'Contracts', icon: ScrollText, path: '/consul/contracts' },
    ],
  },
  {
    id: 'hearth',
    label: 'Hearth',
    icon: Heart,
    color: 'text-hearth',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-hearth',
    activeColor: 'text-hearth-dark',
    activeBg: 'bg-orange-50',
    items: [
      { label: 'Loyalty', icon: Heart, path: '/hearth/loyalty' },
      { label: 'Merchants', icon: Store, path: '/hearth/merchants' },
      { label: 'Campaigns', icon: Megaphone, path: '/hearth/campaigns' },
      { label: 'Analytics', icon: BarChart3, path: '/hearth/analytics' },
      { label: 'Payments', icon: CircleDollarSign, path: '/hearth/payments' },
    ],
  },
  {
    id: 'lodge',
    label: 'Lodge',
    icon: UserCheck,
    color: 'text-lodge',
    bgColor: 'bg-green-500/10',
    textColor: 'text-lodge',
    activeColor: 'text-lodge-dark',
    activeBg: 'bg-green-50',
    items: [
      { label: 'Members', icon: UserCheck, path: '/lodge/members' },
      { label: 'Membership Types', icon: Tag, path: '/lodge/types' },
      { label: 'Events', icon: CalendarRange, path: '/lodge/events' },
      { label: 'Billing', icon: CreditCard, path: '/lodge/billing' },
      { label: 'Communications', icon: Mail, path: '/lodge/communications' },
      { label: 'Chapters', icon: Hash, path: '/lodge/chapters' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleSidebar, setCurrentModule } = useAppStore();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isSectionActive = (section: NavSection) => {
    if (section.id === 'command') {
      return location.pathname === '/' || location.pathname.startsWith('/command');
    }
    return location.pathname.startsWith(`/${section.id}`);
  };

  const handleNav = (path: string, moduleId: string) => {
    setCurrentModule(moduleId as 'command' | 'consul' | 'hearth' | 'lodge');
    navigate(path);
  };

  return (
    <aside
      className={clsx(
        'flex flex-col h-full bg-white border-r border-slate-200/60 transition-all duration-300 ease-in-out flex-shrink-0',
        sidebarCollapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div
        className={clsx(
          'flex items-center h-14 border-b border-slate-100 flex-shrink-0',
          sidebarCollapsed ? 'justify-center px-2' : 'px-4 gap-3',
        )}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forge-500 to-forge-700 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Flame className="w-4.5 h-4.5 text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0 animate-fade-in">
            <h1 className="text-sm font-bold text-ink tracking-tight leading-none">Forge</h1>
            <p className="text-[10px] text-ink-faint leading-none mt-0.5">CANZUK Ltd</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navSections.map((section) => {
          const SectionIcon = section.icon;
          const active = isSectionActive(section);

          return (
            <div key={section.id}>
              {/* Section header */}
              {sidebarCollapsed ? (
                <div className="flex justify-center mb-1">
                  <div
                    className={clsx(
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                      active ? section.bgColor : 'hover:bg-slate-50',
                    )}
                    title={section.label}
                  >
                    <SectionIcon
                      className={clsx(
                        'w-4 h-4 transition-colors',
                        active ? section.color : 'text-ink-faint',
                      )}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-2 mb-1">
                  <SectionIcon
                    className={clsx('w-3.5 h-3.5', active ? section.color : 'text-ink-faint')}
                  />
                  <span
                    className={clsx(
                      'text-[10px] font-semibold uppercase tracking-widest',
                      active ? section.textColor : 'text-ink-faint',
                    )}
                  >
                    {section.label}
                  </span>
                </div>
              )}

              {/* Items */}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const ItemIcon = item.icon;
                  const itemActive = isActive(item.path);

                  return sidebarCollapsed ? (
                    <button
                      key={item.path}
                      onClick={() => handleNav(item.path, section.id)}
                      title={item.label}
                      className={clsx(
                        'w-full flex justify-center p-2 rounded-lg transition-all duration-150',
                        itemActive
                          ? [section.activeBg, section.activeColor]
                          : 'text-ink-tertiary hover:bg-slate-50 hover:text-ink-secondary',
                      )}
                    >
                      <ItemIcon className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      key={item.path}
                      onClick={() => handleNav(item.path, section.id)}
                      className={clsx(
                        'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] transition-all duration-150',
                        itemActive
                          ? [section.activeBg, section.activeColor, 'font-medium']
                          : 'text-ink-tertiary hover:bg-slate-50 hover:text-ink-secondary',
                      )}
                    >
                      <ItemIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer — collapse toggle + user */}
      <div className="flex-shrink-0 border-t border-slate-100 p-2 space-y-1">
        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className={clsx(
            'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-ink-faint hover:text-ink-secondary hover:bg-slate-50 transition-colors',
            sidebarCollapsed && 'justify-center',
          )}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronsRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronsLeft className="w-4 h-4" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>

        {/* User avatar */}
        <div
          className={clsx(
            'flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer',
            sidebarCollapsed && 'justify-center px-0',
          )}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-forge-400 to-forge-600 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-white">JD</span>
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0 animate-fade-in">
              <p className="text-xs font-medium text-ink truncate leading-none">John Doe</p>
              <p className="text-[10px] text-ink-faint leading-none mt-0.5">Admin</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
