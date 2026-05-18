import type { JobCategory } from '@/types';
import { categoryColor } from '@/lib/utils';
import styles from '@/components/listings/CategoryBadge.module.css';

type CategoryBadgeProps = {
  category: JobCategory;
};

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const colors = categoryColor(category);
  return (
    <span
      className={styles.badge}
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {category}
    </span>
  );
}
