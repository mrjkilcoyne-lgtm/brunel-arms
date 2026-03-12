import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AppLayout from './components/layout/AppLayout';

// ---------------------------------------------------------------------------
// Lazy-loaded page components
// ---------------------------------------------------------------------------

// Command
const Dashboard = lazy(() => import('./pages/command/Dashboard'));
const Calendar = lazy(() => import('./pages/command/Calendar'));
const Files = lazy(() => import('./pages/command/Files'));
const Wiki = lazy(() => import('./pages/command/Wiki'));
const Reports = lazy(() => import('./pages/command/Reports'));
const Settings = lazy(() => import('./pages/command/Settings'));
const Workflows = lazy(() => import('./pages/command/Workflows'));
const Team = lazy(() => import('./pages/command/Team'));

// Consul
const Pipeline = lazy(() => import('./pages/consul/Pipeline'));
const Clients = lazy(() => import('./pages/consul/Clients'));
const Projects = lazy(() => import('./pages/consul/Projects'));
const Invoices = lazy(() => import('./pages/consul/Invoices'));
const TimeTracking = lazy(() => import('./pages/consul/TimeTracking'));
const Proposals = lazy(() => import('./pages/consul/Proposals'));
const Contracts = lazy(() => import('./pages/consul/Contracts'));

// Hearth
const Loyalty = lazy(() => import('./pages/hearth/Loyalty'));
const Merchants = lazy(() => import('./pages/hearth/Merchants'));
const Campaigns = lazy(() => import('./pages/hearth/Campaigns'));
const Analytics = lazy(() => import('./pages/hearth/Analytics'));
const Payments = lazy(() => import('./pages/hearth/Payments'));

// Lodge
const Members = lazy(() => import('./pages/lodge/Members'));
const MembershipTypes = lazy(() => import('./pages/lodge/MembershipTypes'));
const Events = lazy(() => import('./pages/lodge/Events'));
const Billing = lazy(() => import('./pages/lodge/Billing'));
const Communications = lazy(() => import('./pages/lodge/Communications'));
const Chapters = lazy(() => import('./pages/lodge/Chapters'));

// ---------------------------------------------------------------------------
// Loading fallback
// ---------------------------------------------------------------------------

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin h-6 w-6 border-2 border-forge-600 border-t-transparent rounded-full" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Placeholder for detail routes
// ---------------------------------------------------------------------------

function PagePlaceholder({ module, page }: { module: string; page: string }) {
  const colors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    command: { bg: 'bg-purple-50', text: 'text-command', border: 'border-purple-200', dot: 'bg-command' },
    consul: { bg: 'bg-blue-50', text: 'text-consul', border: 'border-blue-200', dot: 'bg-consul' },
    hearth: { bg: 'bg-orange-50', text: 'text-hearth', border: 'border-orange-200', dot: 'bg-hearth' },
    lodge: { bg: 'bg-green-50', text: 'text-lodge', border: 'border-green-200', dot: 'bg-lodge' },
  };
  const c = colors[module] || colors.command;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink tracking-tight">{page}</h1>
        <p className="text-sm text-ink-tertiary mt-1">
          <span className={`inline-flex items-center gap-1.5 ${c.text} font-medium`}>
            <span className={`w-2 h-2 rounded-full ${c.dot}`} />
            {module.charAt(0).toUpperCase() + module.slice(1)}
          </span>
          {' '}&middot; Detail view coming soon.
        </p>
      </div>
      <div className={`rounded-xl border-2 border-dashed ${c.border} ${c.bg} p-12 flex items-center justify-center`}>
        <p className="text-sm text-ink-faint">
          Content for <strong className={c.text}>{page}</strong> will appear here.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Command */}
          <Route index element={<Dashboard />} />
          <Route path="command/calendar" element={<Calendar />} />
          <Route path="command/files" element={<Files />} />
          <Route path="command/wiki" element={<Wiki />} />
          <Route path="command/reports" element={<Reports />} />
          <Route path="command/settings" element={<Settings />} />
          <Route path="command/workflows" element={<Workflows />} />
          <Route path="command/team" element={<Team />} />

          {/* Consul */}
          <Route path="consul/pipeline" element={<Pipeline />} />
          <Route path="consul/clients" element={<Clients />} />
          <Route path="consul/clients/:id" element={<PagePlaceholder module="consul" page="Client Detail" />} />
          <Route path="consul/projects" element={<Projects />} />
          <Route path="consul/projects/:id" element={<PagePlaceholder module="consul" page="Project Detail" />} />
          <Route path="consul/invoices" element={<Invoices />} />
          <Route path="consul/invoices/:id" element={<PagePlaceholder module="consul" page="Invoice Detail" />} />
          <Route path="consul/time" element={<TimeTracking />} />
          <Route path="consul/proposals" element={<Proposals />} />
          <Route path="consul/contracts" element={<Contracts />} />

          {/* Hearth */}
          <Route path="hearth/loyalty" element={<Loyalty />} />
          <Route path="hearth/merchants" element={<Merchants />} />
          <Route path="hearth/campaigns" element={<Campaigns />} />
          <Route path="hearth/analytics" element={<Analytics />} />
          <Route path="hearth/payments" element={<Payments />} />

          {/* Lodge */}
          <Route path="lodge/members" element={<Members />} />
          <Route path="lodge/members/:id" element={<PagePlaceholder module="lodge" page="Member Detail" />} />
          <Route path="lodge/types" element={<MembershipTypes />} />
          <Route path="lodge/events" element={<Events />} />
          <Route path="lodge/events/:id" element={<PagePlaceholder module="lodge" page="Event Detail" />} />
          <Route path="lodge/billing" element={<Billing />} />
          <Route path="lodge/communications" element={<Communications />} />
          <Route path="lodge/chapters" element={<Chapters />} />

          {/* Catch-all */}
          <Route path="*" element={<PagePlaceholder module="command" page="Page Not Found" />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
