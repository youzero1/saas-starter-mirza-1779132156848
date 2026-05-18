export type JobCategory =
  | 'Engineering'
  | 'Design'
  | 'Marketing'
  | 'Sales'
  | 'Operations'
  | 'HR'
  | 'Finance'
  | 'Other';

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export type JobStatus = 'Open' | 'Closed' | 'Draft';

export interface JobListing {
  id: string;
  title: string;
  department: string;
  category: JobCategory;
  type: JobType;
  status: JobStatus;
  location: string;
  description: string;
  requirements: string;
  salary: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
