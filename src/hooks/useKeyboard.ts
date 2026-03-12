import { useEffect, useCallback } from 'react';
import { useAppStore } from '../stores/appStore';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[] = []) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      for (const shortcut of shortcuts) {
        const ctrlOrMeta = shortcut.ctrl || shortcut.meta;
        const ctrlMatch = ctrlOrMeta
          ? event.ctrlKey || event.metaKey
          : true;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          // Allow Ctrl+K even in inputs (it's the search shortcut)
          if (isInput && !(ctrlOrMeta && shortcut.key.toLowerCase() === 'k')) {
            continue;
          }
          event.preventDefault();
          shortcut.handler();
          return;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Global keyboard shortcuts — wire these up once in App or AppLayout.
 */
export function useGlobalShortcuts() {
  const toggleSearch = useAppStore((s) => s.toggleSearch);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      handler: toggleSearch,
      description: 'Open command palette',
    },
    {
      key: 'b',
      ctrl: true,
      handler: toggleSidebar,
      description: 'Toggle sidebar',
    },
    {
      key: 'Escape',
      handler: () => {
        const { searchOpen, setSearchOpen } = useAppStore.getState();
        if (searchOpen) setSearchOpen(false);
      },
      description: 'Close overlays',
    },
  ]);
}
