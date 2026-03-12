import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Edit3,
  Clock,
  Tag,
  ChevronRight,
  FileText,
  Hash,
  User,
  Star,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface WikiPage {
  id: string;
  title: string;
  category: string;
  tags: string[];
  lastEdited: string;
  editedBy: string;
  starred?: boolean;
  content: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const wikiPages: WikiPage[] = [
  {
    id: '1',
    title: 'Client Onboarding Process',
    category: 'Processes',
    tags: ['onboarding', 'consul', 'clients'],
    lastEdited: '12 Mar 2026',
    editedBy: 'James Thornton',
    starred: true,
    content: `# Client Onboarding Process

## Overview
This document outlines the standard procedure for onboarding new clients across all CANZUK regions. All team members involved in client acquisition should follow these steps.

## Step 1: Initial Contact
- Schedule discovery call within 24 hours of enquiry
- Send welcome pack via email (use Template WP-001)
- Log contact in Consul CRM

## Step 2: Needs Assessment
- Complete the Client Needs Assessment Form
- Identify primary service requirements
- Determine billing currency (GBP, AUD, CAD, NZD)
- Assign account manager based on region

## Step 3: Proposal & Contract
- Generate proposal using approved templates
- Include service level agreement (SLA)
- Send for internal review before client presentation
- Obtain two signatures for contracts over £10,000

## Step 4: System Setup
- Create client record in Consul
- Configure billing schedule
- Set up project workspace
- Grant appropriate team access

## Step 5: Kickoff
- Schedule kickoff meeting within 5 business days
- Share project timeline and deliverables
- Introduce full team to client

## Regional Notes
- **UK/NZ**: Standard process applies
- **Australia**: Ensure ABN is recorded for GST compliance
- **Canada**: Collect HST/GST registration where applicable`,
  },
  {
    id: '2',
    title: 'Membership Tier Structure',
    category: 'Lodge',
    tags: ['membership', 'tiers', 'lodge', 'pricing'],
    lastEdited: '10 Mar 2026',
    editedBy: 'Liam O\'Brien',
    content: `# Membership Tier Structure

## Tier Overview

| Tier | Monthly Fee | Annual Fee | Benefits |
|------|-----------|-----------|----------|
| Bronze | £29 | £290 | Basic access, newsletter |
| Silver | £59 | £590 | + Priority support, events |
| Gold | £119 | £1,190 | + Dedicated manager, full suite |
| Platinum | £249 | £2,490 | + Custom solutions, 24/7 support |

## Upgrade Paths
Members can upgrade at any time. The pro-rated difference applies to the current billing cycle.

## Retention Rules
- Members inactive for 30 days receive a check-in email
- Members inactive for 60 days are flagged for personal outreach
- Cancellation requires 30-day notice`,
  },
  {
    id: '3',
    title: 'Loyalty Points System',
    category: 'Hearth',
    tags: ['loyalty', 'points', 'hearth', 'rewards'],
    lastEdited: '8 Mar 2026',
    editedBy: 'Aroha Tane',
    starred: true,
    content: `# Loyalty Points System

## Earning Points
- 1 point per £1 spent on services
- 2x points during promotional campaigns
- 50 bonus points for referrals
- 25 bonus points for completing feedback surveys

## Redemption
- 100 points = £1 credit
- Minimum redemption: 500 points
- Points expire after 24 months of inactivity

## Tier Bonuses
- Silver members earn 1.25x points
- Gold members earn 1.5x points
- Platinum members earn 2x points`,
  },
  {
    id: '4',
    title: 'Invoice & Billing Guidelines',
    category: 'Finance',
    tags: ['invoicing', 'billing', 'consul', 'finance'],
    lastEdited: '6 Mar 2026',
    editedBy: 'Emma Clarke',
    content: `# Invoice & Billing Guidelines

## Standard Terms
- Net 30 for all clients unless otherwise agreed
- Late payment fee: 2% per month after 30 days
- Currency is set per client based on their region

## Invoice Numbering
Format: INV-YYYY-XXXX (e.g., INV-2026-0341)

## Approval Workflow
- Under £5,000: Auto-approved
- £5,000-£25,000: Manager approval required
- Over £25,000: Director approval required`,
  },
  {
    id: '5',
    title: 'Brand Guidelines',
    category: 'Marketing',
    tags: ['brand', 'design', 'hearth', 'marketing'],
    lastEdited: '3 Mar 2026',
    editedBy: 'Marcus Chen',
    content: `# Brand Guidelines

## Colours
- Primary: Forge Blue (#4263eb)
- Module colours: Consul Blue, Lodge Green, Hearth Orange, Command Purple
- Neutral palette: Ink shades for text

## Typography
- Headings: Inter Bold
- Body: Inter Regular
- Code: JetBrains Mono

## Logo Usage
- Minimum clear space: 1x logo height
- Never stretch, rotate or recolour the logo
- Dark background variant available`,
  },
  {
    id: '6',
    title: 'Time Tracking Policy',
    category: 'Processes',
    tags: ['time', 'tracking', 'command', 'policy'],
    lastEdited: '1 Mar 2026',
    editedBy: 'James Thornton',
    content: `# Time Tracking Policy

## Requirements
- All billable work must be logged daily
- Minimum time entry: 15 minutes
- Descriptions must include client name and task summary

## Categories
- Client Work (billable)
- Internal Projects (non-billable)
- Administration
- Professional Development

## Reporting
- Weekly summaries due by Friday 5pm
- Monthly reports generated automatically on the 1st`,
  },
];

const categories = ['All', 'Processes', 'Lodge', 'Hearth', 'Finance', 'Marketing'];

// ── Component ──────────────────────────────────────────────────────────────────

const Wiki: React.FC = () => {
  const [selectedPageId, setSelectedPageId] = useState(wikiPages[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const selectedPage = wikiPages.find((p) => p.id === selectedPageId) || wikiPages[0];

  const filteredPages = wikiPages.filter((p) => {
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Simple markdown-like rendering (headings, lists, tables, bold)
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const rendered: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const flushTable = () => {
      if (tableRows.length > 0) {
        const header = tableRows[0];
        const body = tableRows.slice(2); // skip separator row
        rendered.push(
          <div key={`table-${rendered.length}`} className="my-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  {header.map((cell, i) => (
                    <th key={i} className="px-3 py-2 text-left font-semibold text-ink">{cell.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, ri) => (
                  <tr key={ri} className="border-b border-slate-100">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2 text-ink-secondary">{cell.trim()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Table detection
      if (line.startsWith('|')) {
        inTable = true;
        const cells = line.split('|').filter(Boolean);
        tableRows.push(cells);
        continue;
      } else if (inTable) {
        inTable = false;
        flushTable();
      }

      // Headings
      if (line.startsWith('# ')) {
        rendered.push(<h1 key={i} className="mb-4 mt-6 text-2xl font-bold text-ink first:mt-0">{line.slice(2)}</h1>);
      } else if (line.startsWith('## ')) {
        rendered.push(<h2 key={i} className="mb-3 mt-5 text-xl font-semibold text-ink">{line.slice(3)}</h2>);
      } else if (line.startsWith('### ')) {
        rendered.push(<h3 key={i} className="mb-2 mt-4 text-lg font-semibold text-ink">{line.slice(4)}</h3>);
      } else if (line.startsWith('- ')) {
        // Process bold text inside list items
        const text = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        rendered.push(
          <li key={i} className="ml-5 list-disc text-sm text-ink-secondary" dangerouslySetInnerHTML={{ __html: text }} />
        );
      } else if (line.trim() === '') {
        rendered.push(<div key={i} className="h-2" />);
      } else {
        const text = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        rendered.push(
          <p key={i} className="text-sm leading-relaxed text-ink-secondary" dangerouslySetInnerHTML={{ __html: text }} />
        );
      }
    }

    if (inTable) flushTable();
    return rendered;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-command/10">
            <BookOpen className="h-5 w-5 text-command" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink">Wiki</h1>
            <p className="text-sm text-ink-tertiary">Internal knowledge base and documentation</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-command px-4 py-2 text-sm font-medium text-white hover:bg-command-dark">
          <Plus className="h-4 w-4" /> New Page
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Page List Sidebar */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-command focus:outline-none focus:ring-1 focus:ring-command"
            />
          </div>

          {/* Category filter */}
          <div className="mb-3 flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-command text-white'
                    : 'bg-surface-tertiary text-ink-tertiary hover:text-ink-secondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Page list */}
          <div className="space-y-1">
            {filteredPages.map((page) => (
              <button
                key={page.id}
                onClick={() => setSelectedPageId(page.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  selectedPageId === page.id
                    ? 'bg-command/10 text-command'
                    : 'text-ink-secondary hover:bg-surface-tertiary'
                }`}
              >
                <FileText className="h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{page.title}</p>
                  <p className="truncate text-xs text-ink-faint">{page.category}</p>
                </div>
                {page.starred && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />}
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Page header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-ink">{selectedPage.title}</h2>
                <div className="mt-1.5 flex items-center gap-4 text-xs text-ink-faint">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> {selectedPage.editedBy}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {selectedPage.lastEdited}
                  </span>
                  <span className="flex items-center gap-1">
                    <Hash className="h-3 w-3" /> {selectedPage.category}
                  </span>
                </div>
              </div>
              <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-ink-secondary hover:bg-surface-tertiary">
                <Edit3 className="h-4 w-4" /> Edit
              </button>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-3">
              <Tag className="h-3.5 w-3.5 text-ink-faint" />
              {selectedPage.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              {renderContent(selectedPage.content)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wiki;
