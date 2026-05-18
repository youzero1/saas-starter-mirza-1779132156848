import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useListings } from '@/hooks/useListings';
import ListingForm from '@/components/listings/ListingForm';
import type { ListingFormValues } from '@/components/listings/ListingForm';
import EmptyState from '@/components/ui/EmptyState';
import styles from '@/pages/EditListingPage.module.css';

export default function EditListingPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getListingById, updateListing } = useListings();
  const [loading, setLoading] = useState(false);

  const listing = id ? getListingById(id) : undefined;

  if (!listing) {
    return (
      <div className={styles.page}>
        <EmptyState
          title="Listing not found"
          description="The listing you're looking for doesn't exist or has been deleted."
        />
      </div>
    );
  }

  const handleSubmit = (values: ListingFormValues) => {
    if (!id) return;
    setLoading(true);
    updateListing(id, values);
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Back
        </button>
        <div>
          <h1 className={styles.title}>Edit Listing</h1>
          <p className={styles.subtitle}>Update the details for "{listing.title}".</p>
        </div>
      </div>
      <div className={styles.card}>
        <ListingForm
          initialValues={listing}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          isLoading={loading}
        />
      </div>
    </div>
  );
}
