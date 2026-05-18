import type { JobStatus } from '@/types';
import { statusColor } from '@/lib/utils';
import styles from '@/components/listings/StatusBadge.module.css';

type StatusBadgeProps = {
  status: JobStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colors = statusColor(status);
  return (
    <span
      className={styles.badge}
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {status}
    </span>
  );
}
