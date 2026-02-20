export const role = ['USER', 'MANAGER'] as const;
export type Role = (typeof role)[number];
