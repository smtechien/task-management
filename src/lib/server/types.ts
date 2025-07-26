import { bigTasks, smallTasks } from '$lib/server/db/schema';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'; 

export type BigTasks = InferSelectModel<typeof bigTasks>;
export type NewBigTasks = InferInsertModel<typeof bigTasks>;
export type UpdateBigTasksPayload = Partial<Omit<NewBigTasks, 'id' | 'createdAt' | 'updatedAt'>>;


export type SmallTasks = InferSelectModel<typeof smallTasks>;
export type NewSmallTasks = InferInsertModel<typeof smallTasks>;
export type UpdateSmallTasksPayload = Partial<Omit<NewSmallTasks, 'id' | 'createdAt' | 'updatedAt' | 'parentTaskId'>>;
