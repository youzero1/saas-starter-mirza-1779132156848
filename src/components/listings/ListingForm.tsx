import { useState } from 'react';
import type { FormEvent } from 'react';
import type { JobListing, JobCategory, JobType, JobStatus } from '@/types';
import { JOB_CATEGORIES, JOB_TYPES, JOB_STATUSES } from '@/lib/utils';
import styles from '@/components/listings/ListingForm.module.css';

type ListingFormProps = {
  initialValues?: Partial<JobListing>;
  onSubmit: (values: ListingFormValues) => void;
  submitLabel: string;
  isLoading?: boolean;
};

export type ListingFormValues = {
  title: string;
  department: string;
  category: JobCategory;
  type: JobType;
  status: JobStatus;
  location: string;
  description: string;
  requirements: string;
  salary: string;
};

const DEFAULTS: ListingFormValues = {
  title: '',
  department: '',
  category: 'Engineering',
  type: 'Full-time',
  status: 'Open',
  location: '',
  description: '',
  requirements: '',
  salary: '',
};

export default function ListingForm({ initialValues, onSubmit, submitLabel, isLoading }: ListingFormProps) {
  const [values, setValues] = useState<ListingFormValues>({
    ...DEFAULTS,
    ...initialValues,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ListingFormValues, string>>>({});

  const set = <K extends keyof ListingFormValues>(key: K, value: ListingFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ListingFormValues, string>> = {};
    if (!values.title.trim()) newErrors.title = 'Title is required';
    if (!values.department.trim()) newErrors.department = 'Department is required';
    if (!values.location.trim()) newErrors.location = 'Location is required';
    if (!values.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Job Title *</label>
          <input
            className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
            type="text"
            placeholder="e.g. Senior Frontend Engineer"
            value={values.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => set('title', e.target.value)}
          />
          {errors.title && <span className={styles.error}>{errors.title}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Department *</label>
          <input
            className={`${styles.input} ${errors.department ? styles.inputError : ''}`}
            type="text"
            placeholder="e.g. Engineering, Product"
            value={values.department}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => set('department', e.target.value)}
          />
          {errors.department && <span className={styles.error}>{errors.department}</span>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Category *</label>
          <select
            className={styles.select}
            value={values.category}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => set('category', e.target.value as JobCategory)}
          >
            {JOB_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Job Type *</label>
          <select
            className={styles.select}
            value={values.type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => set('type', e.target.value as JobType)}
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Status *</label>
          <select
            className={styles.select}
            value={values.status}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => set('status', e.target.value as JobStatus)}
          >
            {JOB_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Location *</label>
          <input
            className={`${styles.input} ${errors.location ? styles.inputError : ''}`}
            type="text"
            placeholder="e.g. Remote, New York, NY"
            value={values.location}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => set('location', e.target.value)}
          />
          {errors.location && <span className={styles.error}>{errors.location}</span>}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Salary / Compensation</label>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. $80,000 – $100,000"
          value={values.salary}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => set('salary', e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description *</label>
        <textarea
          className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
          rows={4}
          placeholder="Describe the role and responsibilities…"
          value={values.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => set('description', e.target.value)}
        />
        {errors.description && <span className={styles.error}>{errors.description}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Requirements</label>
        <textarea
          className={styles.textarea}
          rows={3}
          placeholder="List skills, experience, qualifications…"
          value={values.requirements}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => set('requirements', e.target.value)}
        />
      </div>

      <div className={styles.submit}>
        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
