import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Filter, Database } from 'lucide-react';
import { useListings } from '@/hooks/useListings';
import ListingCard from '@/components/listings/ListingCard';
import CategoryBadge from '@/components/listings/CategoryBadge';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import type { JobCategory, JobStatus } from '@/types';
import { JOB_CATEGORIES, JOB_STATUSES } from '@/lib/utils';
import styles from '@/pages/DashboardPage.module.css';

const ALL = 'All';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { listings, dbReady, deleteListing } = useListings();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<JobCategory | typeof ALL>(ALL);
  const [activeStatus, setActiveStatus] = useState<JobStatus | typeof ALL>(ALL);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const matchSearch =
        !search ||
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.department.toLowerCase().includes(search.toLowerCase()) ||
        l.location.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === ALL || l.category === activeCategory;
      const matchStatus = activeStatus === ALL || l.status === activeStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [listings, search, activeCategory, activeStatus]);

  const stats = useMemo(
    () => ({
      total: listings.length,
      open: listings.filter((l) => l.status === 'Open').length,
      draft: listings.filter((l) => l.status === 'Draft').length,
      closed: listings.filter((l) => l.status === 'Closed').length,
    }),
    [listings]
  );

  const handleDelete = (id: string) => setDeleteId(id);
  const confirmDelete = () => {
    if (deleteId) deleteListing(deleteId);
    setDeleteId(null);
  };

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Job Listings</h1>
          <p className={styles.pageSubtitle}>Manage all internal job postings</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.dbBadge}>
            <Database size={13} />
            <span>{dbReady ? 'IndexedDB connected' : 'Connecting…'}</span>
            <span
              className={styles.dbDot}
              style={{ background: dbReady ? 'var(--color-success)' : 'var(--color-text-muted)' }}
            />
          </div>
          <button className={styles.newBtn} onClick={() => navigate('/listings/new')}>
            <PlusCircle size={16} />
            Post a Job
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        {[
          { label: 'Total Listings', value: stats.total, color: 'var(--color-primary)' },
          { label: 'Open', value: stats.open, color: 'var(--color-success)' },
          { label: 'Draft', value: stats.draft, color: 'var(--color-text-muted)' },
          { label: 'Closed', value: stats.closed, color: 'var(--color-danger)' },
        ].map((s) => (
          <div key={s.label} className={styles.statCard}>
            <span className={styles.statValue} style={{ color: s.color }}>
              {s.value}
            </span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={styles.filtersBar}>
        <div className={styles.searchWrapper}>
          <Search size={15} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search by title, department, location…"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <Filter size={14} color="var(--color-text-muted)" />
          <select
            className={styles.filterSelect}
            value={activeStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setActiveStatus(e.target.value as JobStatus | typeof ALL)
            }
          >
            <option value={ALL}>All Statuses</option>
            {JOB_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category tabs */}
      <div className={styles.categoryTabs}>
        <button
          className={`${styles.catTab} ${
            activeCategory === ALL ? styles.catTabActive : ''
          }`}
          onClick={() => setActiveCategory(ALL)}
        >
          All
        </button>
        {JOB_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles.catTab} ${
              activeCategory === cat ? styles.catTabActive : ''
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            <CategoryBadge category={cat} />
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {!dbReady ? (
        <div className={styles.loadingGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={styles.grid}>
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Confirm delete dialog */}
      {deleteId && (
        <ConfirmDialog
          title="Delete Listing"
          message="Are you sure you want to delete this job listing? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
