export type User = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'MANAGER';
  status?: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
};
