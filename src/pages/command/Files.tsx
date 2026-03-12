import React, { useState } from 'react';
import {
  FolderOpen,
  Folder,
  FileText,
  FileImage,
  FileSpreadsheet,
  File,
  Search,
  Grid3X3,
  List,
  Upload,
  Download,
  MoreVertical,
  ChevronRight,
  HardDrive,
  Filter,
  Star,
  Trash2,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface FolderNode {
  id: string;
  name: string;
  module?: 'Consul' | 'Lodge' | 'Hearth' | 'Command';
  children?: FolderNode[];
}

interface FileItem {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'png' | 'jpg' | 'csv' | 'txt';
  size: string;
  modified: string;
  modifiedBy: string;
  folder: string;
  starred?: boolean;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const folderTree: FolderNode[] = [
  {
    id: 'consul',
    name: 'Consul',
    module: 'Consul',
    children: [
      { id: 'consul-invoices', name: 'Invoices' },
      { id: 'consul-contracts', name: 'Contracts' },
      { id: 'consul-proposals', name: 'Proposals' },
    ],
  },
  {
    id: 'lodge',
    name: 'Lodge',
    module: 'Lodge',
    children: [
      { id: 'lodge-applications', name: 'Applications' },
      { id: 'lodge-policies', name: 'Policies' },
    ],
  },
  {
    id: 'hearth',
    name: 'Hearth',
    module: 'Hearth',
    children: [
      { id: 'hearth-campaigns', name: 'Campaigns' },
      { id: 'hearth-assets', name: 'Brand Assets' },
    ],
  },
  {
    id: 'command',
    name: 'Command',
    module: 'Command',
    children: [
      { id: 'command-reports', name: 'Reports' },
      { id: 'command-templates', name: 'Templates' },
      { id: 'command-legal', name: 'Legal' },
    ],
  },
];

const mockFiles: FileItem[] = [
  { id: '1', name: 'Q1-2026-Revenue-Report.pdf', type: 'pdf', size: '2.4 MB', modified: '12 Mar 2026', modifiedBy: 'Emma Clarke', folder: 'command-reports', starred: true },
  { id: '2', name: 'Barclays-Contract-Renewal.docx', type: 'docx', size: '842 KB', modified: '11 Mar 2026', modifiedBy: 'James Thornton', folder: 'consul-contracts' },
  { id: '3', name: 'ANZ-Group-Invoice-0341.pdf', type: 'pdf', size: '156 KB', modified: '10 Mar 2026', modifiedBy: 'Sarah Whitfield', folder: 'consul-invoices' },
  { id: '4', name: 'Member-Engagement-Stats.xlsx', type: 'xlsx', size: '1.1 MB', modified: '10 Mar 2026', modifiedBy: 'Liam O\'Brien', folder: 'lodge-applications' },
  { id: '5', name: 'Auckland-Campaign-Banner.png', type: 'png', size: '3.8 MB', modified: '9 Mar 2026', modifiedBy: 'Aroha Tane', folder: 'hearth-assets', starred: true },
  { id: '6', name: 'Loyalty-Points-Audit-Feb.xlsx', type: 'xlsx', size: '780 KB', modified: '8 Mar 2026', modifiedBy: 'Marcus Chen', folder: 'hearth-campaigns' },
  { id: '7', name: 'TD-Bank-Proposal-Draft.docx', type: 'docx', size: '1.5 MB', modified: '7 Mar 2026', modifiedBy: 'James Thornton', folder: 'consul-proposals' },
  { id: '8', name: 'Company-Logo-Suite.png', type: 'png', size: '5.2 MB', modified: '5 Mar 2026', modifiedBy: 'Emma Clarke', folder: 'hearth-assets' },
  { id: '9', name: 'Gold-Tier-Policy-v3.pdf', type: 'pdf', size: '340 KB', modified: '4 Mar 2026', modifiedBy: 'Liam O\'Brien', folder: 'lodge-policies' },
  { id: '10', name: 'Tax-Filing-Template.xlsx', type: 'xlsx', size: '420 KB', modified: '3 Mar 2026', modifiedBy: 'Emma Clarke', folder: 'command-templates', starred: true },
  { id: '11', name: 'NDA-Standard-Template.docx', type: 'docx', size: '128 KB', modified: '1 Mar 2026', modifiedBy: 'James Thornton', folder: 'command-legal' },
  { id: '12', name: 'Customer-Export-Feb.csv', type: 'csv', size: '2.1 MB', modified: '28 Feb 2026', modifiedBy: 'Marcus Chen', folder: 'hearth-campaigns' },
];

const storageStats = {
  used: 24.6,
  total: 50,
  breakdown: [
    { label: 'Documents', size: 8.2, color: 'bg-blue-500' },
    { label: 'Images', size: 9.4, color: 'bg-emerald-500' },
    { label: 'Spreadsheets', size: 4.8, color: 'bg-orange-500' },
    { label: 'Other', size: 2.2, color: 'bg-slate-400' },
  ],
};

// ── Helpers ────────────────────────────────────────────────────────────────────

const fileIcons: Record<FileItem['type'], React.ElementType> = {
  pdf: FileText,
  docx: FileText,
  xlsx: FileSpreadsheet,
  png: FileImage,
  jpg: FileImage,
  csv: FileSpreadsheet,
  txt: File,
};

const fileIconColors: Record<FileItem['type'], string> = {
  pdf: 'text-red-500 bg-red-50',
  docx: 'text-blue-600 bg-blue-50',
  xlsx: 'text-emerald-600 bg-emerald-50',
  png: 'text-purple-500 bg-purple-50',
  jpg: 'text-purple-500 bg-purple-50',
  csv: 'text-emerald-600 bg-emerald-50',
  txt: 'text-slate-500 bg-slate-50',
};

const moduleColors: Record<string, string> = {
  Consul: 'text-blue-600',
  Lodge: 'text-emerald-600',
  Hearth: 'text-orange-600',
  Command: 'text-purple-600',
};

// ── Component ──────────────────────────────────────────────────────────────────

const Files: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['command']));
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredFiles = mockFiles.filter((f) => {
    const matchFolder = !selectedFolder || f.folder === selectedFolder;
    const matchSearch = !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFolder && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-command/10">
            <FolderOpen className="h-5 w-5 text-command" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink">Files</h1>
            <p className="text-sm text-ink-tertiary">Manage documents across all modules</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-command px-4 py-2 text-sm font-medium text-white hover:bg-command-dark">
          <Upload className="h-4 w-4" /> Upload
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-command focus:outline-none focus:ring-1 focus:ring-command"
          />
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-ink-secondary hover:bg-surface-tertiary">
          <Filter className="h-4 w-4" /> Filter
        </button>
        <div className="flex rounded-lg border border-slate-200">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-command text-white' : 'text-ink-secondary hover:bg-surface-tertiary'} rounded-l-lg`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-command text-white' : 'text-ink-secondary hover:bg-surface-tertiary'} rounded-r-lg`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Folder Sidebar */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-ink">Folders</h3>
          <button
            onClick={() => setSelectedFolder(null)}
            className={`mb-2 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
              !selectedFolder ? 'bg-command/10 font-medium text-command' : 'text-ink-secondary hover:bg-surface-tertiary'
            }`}
          >
            <FolderOpen className="h-4 w-4" /> All Files
          </button>

          <div className="space-y-0.5">
            {folderTree.map((folder) => (
              <div key={folder.id}>
                <button
                  onClick={() => toggleFolder(folder.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${moduleColors[folder.module!]} hover:bg-surface-tertiary`}
                >
                  <ChevronRight
                    className={`h-3 w-3 transition-transform ${expandedFolders.has(folder.id) ? 'rotate-90' : ''}`}
                  />
                  <Folder className="h-4 w-4" />
                  <span className="font-medium">{folder.name}</span>
                </button>
                {expandedFolders.has(folder.id) && folder.children && (
                  <div className="ml-5 mt-0.5 space-y-0.5">
                    {folder.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => setSelectedFolder(child.id)}
                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
                          selectedFolder === child.id
                            ? 'bg-command/10 font-medium text-command'
                            : 'text-ink-secondary hover:bg-surface-tertiary'
                        }`}
                      >
                        <Folder className="h-3.5 w-3.5" />
                        {child.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Storage Stats */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
              <HardDrive className="h-4 w-4 text-ink-faint" /> Storage
            </div>
            <p className="mb-2 text-xs text-ink-tertiary">
              {storageStats.used} GB of {storageStats.total} GB used
            </p>
            <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-command"
                style={{ width: `${(storageStats.used / storageStats.total) * 100}%` }}
              />
            </div>
            <div className="space-y-1.5">
              {storageStats.breakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-ink-secondary">
                    <span className={`h-2 w-2 rounded-full ${item.color}`} />
                    {item.label}
                  </span>
                  <span className="text-ink-tertiary">{item.size} GB</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* File Grid / List */}
        <div className="lg:col-span-3">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredFiles.map((file) => {
                const Icon = fileIcons[file.type];
                const iconColor = fileIconColors[file.type];
                return (
                  <div
                    key={file.id}
                    className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconColor}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex items-center gap-1">
                        {file.starred && <Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
                        <button className="rounded p-1 opacity-0 transition-opacity hover:bg-surface-tertiary group-hover:opacity-100">
                          <MoreVertical className="h-4 w-4 text-ink-faint" />
                        </button>
                      </div>
                    </div>
                    <p className="mb-1 truncate text-sm font-medium text-ink">{file.name}</p>
                    <p className="text-xs text-ink-faint">
                      {file.size} &middot; {file.modified}
                    </p>
                    <p className="mt-1 text-xs text-ink-faint">by {file.modifiedBy}</p>
                    <div className="mt-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button className="flex items-center gap-1 rounded border border-slate-200 px-2 py-1 text-xs text-ink-secondary hover:bg-surface-tertiary">
                        <Download className="h-3 w-3" /> Download
                      </button>
                      <button className="flex items-center gap-1 rounded border border-slate-200 px-2 py-1 text-xs text-red-500 hover:bg-red-50">
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left">
                    <th className="px-4 py-3 font-semibold text-ink-tertiary">Name</th>
                    <th className="px-4 py-3 font-semibold text-ink-tertiary">Size</th>
                    <th className="px-4 py-3 font-semibold text-ink-tertiary">Modified</th>
                    <th className="px-4 py-3 font-semibold text-ink-tertiary">By</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => {
                    const Icon = fileIcons[file.type];
                    const iconColor = fileIconColors[file.type];
                    return (
                      <tr key={file.id} className="group border-b border-slate-50 last:border-0 hover:bg-surface-secondary">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded ${iconColor}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <span className="font-medium text-ink">{file.name}</span>
                            {file.starred && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-ink-tertiary">{file.size}</td>
                        <td className="px-4 py-3 text-ink-tertiary">{file.modified}</td>
                        <td className="px-4 py-3 text-ink-tertiary">{file.modifiedBy}</td>
                        <td className="px-4 py-3">
                          <button className="rounded p-1 opacity-0 hover:bg-surface-tertiary group-hover:opacity-100">
                            <MoreVertical className="h-4 w-4 text-ink-faint" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Files;
