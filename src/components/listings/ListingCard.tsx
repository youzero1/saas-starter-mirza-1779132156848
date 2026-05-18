import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Pencil, Trash2, DollarSign } from 'lucide-react';
import type { JobListing } from '@/types';
import CategoryBadge from '@/components/listings/CategoryBadge';
import StatusBadge from '@/components/listings/StatusBadge';
import { formatDate } from '@/lib/utils';
import styles from '@/components/listings/ListingCard.module.css';

type ListingCardProps = {
  listing: JobListing;
  onDelete: (id: string) => void;
};

export default function ListingCard({ listing, onDelete }: ListingCardProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.badges}>
          <CategoryBadge category={listing.category} />
          <StatusBadge status={listing.status} />
        </div>
        <div className={styles.actions}>
          <button
            className={styles.editBtn}
            onClick={() => navigate(`/listings/${listing.id}/edit`)}
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            className={styles.deleteBtn}
            onClick={() => onDelete(listing.id)}
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <h3 className={styles.title}>{listing.title}</h3>
      <p className={styles.department}>{listing.department}</p>

      <p className={styles.description}>{listing.description}</p>

      <div className={styles.meta}>
        <span className={styles.metaItem}>
          <MapPin size={13} />
          {listing.location}
        </span>
        <span className={styles.metaItem}>
          <Clock size={13} />
          {listing.type}
        </span>
        {listing.salary && (
          <span className={styles.metaItem}>
            <DollarSign size={13} />
            {listing.salary}
          </span>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.createdBy}>Posted by {listing.createdBy}</span>
        <span className={styles.date}>{formatDate(listing.createdAt)}</span>
      </div>
    </div>
  );
}
