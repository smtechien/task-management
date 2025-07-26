import { z } from 'zod';

// base schema
const baseTaskFields = z.object({
  title: z.string().trim().min(1, 'Title cannot be empty.'),
  description: z.string().trim().nullable(),
  details: z.string().trim().nullable(),
  dueDate: z.string().datetime().nullable(),
  isCompleted: z.boolean(),
  
})


// Schema for creating a new bigTasks ( POST /api/bigTasks )
export const createBigTasksSchema = baseTaskFields.extend({
  dueDate: baseTaskFields.shape.dueDate.optional(),
  isCompleted: baseTaskFields.shape.isCompleted.default(false),
})

// Schema for partially updating the bigTasks record ( PATCH /api/[id]/bigTasks)
export const  patchBigTasksSchema = baseTaskFields.partial();

// Schema for creating a new smallTasks ( POST /api/smallTasks )
export const createSmallTasksSchema = baseTaskFields.extend({
  dueDate: baseTaskFields.shape.dueDate.optional(),
  isCompleted: baseTaskFields.shape.isCompleted.default(false),
  parentTaskId: z.number().int().positive('parentTaskId must be a positive integer')
})

export const patchSmallTaskSchema = baseTaskFields.partial();

