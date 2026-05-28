import { z } from 'zod'

export const adminUserSchema = z.object({
  id: z.union([z.string(), z.number()]).transform((value) => String(value)),
  username: z.string().catch('unknown-user'),
  roles: z.array(z.string()).catch([]),
})

export const rolesUpdateSchema = z.object({
  roles: z.array(z.string()).min(1, 'At least one role is required'),
})

export type RolesUpdateInput = z.infer<typeof rolesUpdateSchema>
