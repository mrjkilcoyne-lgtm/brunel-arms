import { create } from 'zustand';
import type { ModuleName, Notification, User } from '../types';

interface AppState {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Current module
  currentModule: ModuleName;
  setCurrentModule: (module: ModuleName) => void;

  // Command palette / search
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  toggleSearch: () => void;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  // User
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Current module
  currentModule: 'command',
  setCurrentModule: (module) => set({ currentModule: module }),

  // Command palette / search
  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
  toggleSearch: () => set((s) => ({ searchOpen: !s.searchOpen })),

  // Notifications
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set((s) => ({
      notifications: [notification, ...s.notifications],
      unreadCount: s.unreadCount + 1,
    })),
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, s.unreadCount - 1),
    })),
  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

  // User
  user: null,
  setUser: (user) => set({ user }),
}));
