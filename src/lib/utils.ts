import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import type { JobCategory, JobType, JobStatus } from '@/types';

export function cn(...inputs: ClassValue[]): string {
  return clsx(...inputs);
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso));
}

export const JOB_CATEGORIES: JobCategory[] = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Operations',
  'HR',
  'Finance',
  'Other',
];

export const JOB_TYPES: JobType[] = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
];

export const JOB_STATUSES: JobStatus[] = ['Open', 'Closed', 'Draft'];

export function categoryColor(category: JobCategory): { bg: string; text: string } {
  const map: Record<JobCategory, { bg: string; text: string }> = {
    Engineering: { bg: 'var(--color-cat-engineering-bg)', text: 'var(--color-cat-engineering)' },
    Design: { bg: 'var(--color-cat-design-bg)', text: 'var(--color-cat-design)' },
    Marketing: { bg: 'var(--color-cat-marketing-bg)', text: 'var(--color-cat-marketing)' },
    Sales: { bg: 'var(--color-cat-sales-bg)', text: 'var(--color-cat-sales)' },
    Operations: { bg: 'var(--color-cat-operations-bg)', text: 'var(--color-cat-operations)' },
    HR: { bg: 'var(--color-cat-hr-bg)', text: 'var(--color-cat-hr)' },
    Finance: { bg: 'var(--color-cat-finance-bg)', text: 'var(--color-cat-finance)' },
    Other: { bg: 'var(--color-cat-other-bg)', text: 'var(--color-cat-other)' },
  };
  return map[category];
}

export function statusColor(status: JobStatus): { bg: string; text: string } {
  const map: Record<JobStatus, { bg: string; text: string }> = {
    Open: { bg: 'var(--color-success-light)', text: 'var(--color-success)' },
    Closed: { bg: 'var(--color-danger-light)', text: 'var(--color-danger)' },
    Draft: { bg: 'var(--color-surface-2)', text: 'var(--color-text-secondary)' },
  };
  return map[status];
}
