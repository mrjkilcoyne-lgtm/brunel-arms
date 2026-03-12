import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import CommandPalette from '../shared/CommandPalette';
import { useGlobalShortcuts } from '../../hooks/useKeyboard';

export default function AppLayout() {
  useGlobalShortcuts();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-secondary">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <TopBar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Command Palette overlay */}
      <CommandPalette />
    </div>
  );
}
