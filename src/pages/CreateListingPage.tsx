import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useListings } from '@/hooks/useListings';
import { useAuth } from '@/hooks/useAuth';
import ListingForm from '@/components/listings/ListingForm';
import type { ListingFormValues } from '@/components/listings/ListingForm';
import styles from '@/pages/CreateListingPage.module.css';

export default function CreateListingPage() {
  const navigate = useNavigate();
  const { createListing } = useListings();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: ListingFormValues) => {
    setLoading(true);
    createListing({
      ...values,
      createdBy: user ? user.name : 'Unknown',
    });
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
          <h1 className={styles.title}>Post a New Job</h1>
          <p className={styles.subtitle}>Fill in the details to create a new job listing.</p>
        </div>
      </div>
      <div className={styles.card}>
        <ListingForm
          onSubmit={handleSubmit}
          submitLabel="Publish Listing"
          isLoading={loading}
        />
      </div>
    </div>
  );
}
