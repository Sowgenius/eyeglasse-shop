import { z } from 'zod';
import { customerSchema, customerUpdateSchema, querySchema } from './customer.validation';

export type Customer = z.infer<typeof customerSchema>;
export type CustomerUpdate = z.infer<typeof customerUpdateSchema>;
export type Query = z.infer<typeof querySchema>;
