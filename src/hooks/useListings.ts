import { useState, useEffect, useCallback } from 'react';
import type { JobListing, JobCategory } from '@/types';
import { generateId, nowISO } from '@/lib/utils';
import {
  dbGetAll,
  dbGet,
  dbPut,
  dbDelete,
  dbCount,
  LISTINGS_STORE,
} from '@/lib/db';

const SEED_LISTINGS: JobListing[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    department: 'Product',
    category: 'Engineering',
    type: 'Full-time',
    status: 'Open',
    location: 'Remote',
    description:
      'We are looking for a seasoned frontend engineer to join our product team and build world-class interfaces.',
    requirements:
      '5+ years of experience with React, TypeScript proficiency, attention to detail.',
    salary: '$120,000 – $150,000',
    createdBy: 'Alice Johnson',
    createdAt: '2024-11-01T09:00:00Z',
    updatedAt: '2024-11-01T09:00:00Z',
  },
  {
    id: '2',
    title: 'Product Designer',
    department: 'Design',
    category: 'Design',
    type: 'Full-time',
    status: 'Open',
    location: 'New York, NY',
    description: 'Join our design team to craft beautiful, user-centered products.',
    requirements:
      'Experience with Figma, strong portfolio, knowledge of design systems.',
    salary: '$90,000 – $115,000',
    createdBy: 'Bob Smith',
    createdAt: '2024-11-05T11:00:00Z',
    updatedAt: '2024-11-05T11:00:00Z',
  },
  {
    id: '3',
    title: 'Growth Marketing Manager',
    department: 'Marketing',
    category: 'Marketing',
    type: 'Full-time',
    status: 'Open',
    location: 'San Francisco, CA',
    description: 'Lead our growth initiatives across paid and organic channels.',
    requirements:
      '3+ years in growth marketing, data-driven mindset, SaaS experience preferred.',
    salary: '$85,000 – $105,000',
    createdBy: 'Carol White',
    createdAt: '2024-11-10T14:00:00Z',
    updatedAt: '2024-11-10T14:00:00Z',
  },
  {
    id: '4',
    title: 'Sales Development Representative',
    department: 'Sales',
    category: 'Sales',
    type: 'Full-time',
    status: 'Draft',
    location: 'Chicago, IL',
    description:
      'Drive outbound prospecting and qualify new business opportunities.',
    requirements: '1–2 years SDR experience, excellent communication skills.',
    salary: '$55,000 – $70,000 + commission',
    createdBy: 'Alice Johnson',
    createdAt: '2024-11-12T08:00:00Z',
    updatedAt: '2024-11-12T08:00:00Z',
  },
  {
    id: '5',
    title: 'HR Business Partner',
    department: 'People Ops',
    category: 'HR',
    type: 'Full-time',
    status: 'Closed',
    location: 'Austin, TX',
    description:
      'Partner with business leaders to drive talent strategy and employee experience.',
    requirements: '4+ years in HR or people ops, SHRM certification a plus.',
    salary: '$80,000 – $100,000',
    createdBy: 'Bob Smith',
    createdAt: '2024-10-20T10:00:00Z',
    updatedAt: '2024-10-20T10:00:00Z',
  },
];

export type CreateListingInput = Omit<JobListing, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateListingInput = Partial<Omit<JobListing, 'id' | 'createdAt' | 'createdBy'>>;

export function useListings() {
  const [listings, setListings] = useState<JobListing[]>([]);
  const [dbReady, setDbReady] = useState(false);

  // Load all listings from IndexedDB on mount; seed if empty
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const count = await dbCount(LISTINGS_STORE);

        if (count === 0) {
          // Seed the database
          for (const listing of SEED_LISTINGS) {
            await dbPut<JobListing>(LISTINGS_STORE, listing);
          }
        }

        const all = await dbGetAll<JobListing>(LISTINGS_STORE);
        // Sort newest first
        all.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        if (!cancelled) {
          setListings(all);
          setDbReady(true);
        }
      } catch (err) {
        console.error('[DB] init error', err);
        if (!cancelled) setDbReady(true);
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  const refresh = useCallback(async () => {
    const all = await dbGetAll<JobListing>(LISTINGS_STORE);
    all.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setListings(all);
  }, []);

  const createListing = useCallback(
    async (input: CreateListingInput): Promise<JobListing> => {
      const now = nowISO();
      const newListing: JobListing = {
        ...input,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      await dbPut<JobListing>(LISTINGS_STORE, newListing);
      await refresh();
      return newListing;
    },
    [refresh]
  );

  const updateListing = useCallback(
    async (id: string, input: UpdateListingInput): Promise<boolean> => {
      const existing = await dbGet<JobListing>(LISTINGS_STORE, id);
      if (!existing) return false;
      const updated: JobListing = { ...existing, ...input, updatedAt: nowISO() };
      await dbPut<JobListing>(LISTINGS_STORE, updated);
      await refresh();
      return true;
    },
    [refresh]
  );

  const deleteListing = useCallback(
    async (id: string): Promise<boolean> => {
      const existing = await dbGet<JobListing>(LISTINGS_STORE, id);
      if (!existing) return false;
      await dbDelete(LISTINGS_STORE, id);
      await refresh();
      return true;
    },
    [refresh]
  );

  const getListingById = useCallback(
    (id: string): JobListing | undefined => listings.find((l) => l.id === id),
    [listings]
  );

  const getByCategory = useCallback(
    (category: JobCategory): JobListing[] =>
      listings.filter((l) => l.category === category),
    [listings]
  );

  return {
    listings,
    dbReady,
    createListing,
    updateListing,
    deleteListing,
    getListingById,
    getByCategory,
  };
}
