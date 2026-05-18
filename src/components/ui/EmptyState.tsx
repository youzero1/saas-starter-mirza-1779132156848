import { Inbox } from 'lucide-react';
import styles from '@/components/ui/EmptyState.module.css';

type EmptyStateProps = {
  title?: string;
  description?: string;
};

export default function EmptyState({
  title = 'No listings found',
  description = 'Try adjusting your filters or create a new job posting.',
}: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <Inbox size={36} color="var(--color-text-muted)" />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
