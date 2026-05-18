import { useState, useEffect } from 'react';
import type { JobListing, JobCategory } from '@/types';
import { generateId, nowISO } from '@/lib/utils';

const STORAGE_KEY = 'jb_listings';

const SEED_LISTINGS: JobListing[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    department: 'Product',
    category: 'Engineering',
    type: 'Full-time',
    status: 'Open',
    location: 'Remote',
    description: 'We are looking for a seasoned frontend engineer to join our product team and build world-class interfaces.',
    requirements: '5+ years of experience with React, TypeScript proficiency, attention to detail.',
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
    requirements: 'Experience with Figma, strong portfolio, knowledge of design systems.',
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
    requirements: '3+ years in growth marketing, data-driven mindset, SaaS experience preferred.',
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
    description: 'Drive outbound prospecting and qualify new business opportunities.',
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
    description: 'Partner with business leaders to drive talent strategy and employee experience.',
    requirements: '4+ years in HR or people ops, SHRM certification a plus.',
    salary: '$80,000 – $100,000',
    createdBy: 'Bob Smith',
    createdAt: '2024-10-20T10:00:00Z',
    updatedAt: '2024-10-20T10:00:00Z',
  },
];

function loadFromStorage(): JobListing[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as JobListing[];
  } catch {
    // ignore
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_LISTINGS));
  return SEED_LISTINGS;
}

function saveToStorage(listings: JobListing[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
}

export type CreateListingInput = Omit<JobListing, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateListingInput = Partial<Omit<JobListing, 'id' | 'createdAt' | 'createdBy'>>;

export function useListings() {
  const [listings, setListings] = useState<JobListing[]>([]);

  useEffect(() => {
    setListings(loadFromStorage());
  }, []);

  const createListing = (input: CreateListingInput): JobListing => {
    const now = nowISO();
    const newListing: JobListing = {
      ...input,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newListing, ...listings];
    saveToStorage(updated);
    setListings(updated);
    return newListing;
  };

  const updateListing = (id: string, input: UpdateListingInput): boolean => {
    const idx = listings.findIndex((l) => l.id === id);
    if (idx === -1) return false;
    const updated = listings.map((l) =>
      l.id === id ? { ...l, ...input, updatedAt: nowISO() } : l
    );
    saveToStorage(updated);
    setListings(updated);
    return true;
  };

  const deleteListing = (id: string): boolean => {
    const updated = listings.filter((l) => l.id !== id);
    if (updated.length === listings.length) return false;
    saveToStorage(updated);
    setListings(updated);
    return true;
  };

  const getListingById = (id: string): JobListing | undefined =>
    listings.find((l) => l.id === id);

  const getByCategory = (category: JobCategory): JobListing[] =>
    listings.filter((l) => l.category === category);

  return {
    listings,
    createListing,
    updateListing,
    deleteListing,
    getListingById,
    getByCategory,
  };
}
