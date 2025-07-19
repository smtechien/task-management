import { pgTable, serial, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const bigTasks = pgTable('big_tasks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  details: text('details'),
  dueDate: timestamp('due_date', { withTimezone: true, mode: 'string'}),
  isCompleted: boolean('is_completed').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string'}).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string'}).defaultNow().notNull(), // add anything later
});

export const smallTasks = pgTable('small_tasks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  details: text('details'),
  dueDate: timestamp('due_date', { withTimezone: true, mode: 'string'}),
  isCompleted: boolean('is_completed').default(false).notNull(),
  parentTaskId: integer('parent_task_id').references(() => bigTasks.id, {onDelete: 'cascade'}),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string'}).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string'}).defaultNow().notNull(), // add anything later
});

export const bigTasksRelations = relations(bigTasks, ({ many }) => ({
  parent: many(smallTasks, { relationName: 'parent' }),
}));

export const smallTasksReations = relations(smallTasks, ({ one }) => ({
  parent: one(bigTasks, {
    fields: [smallTasks.parentTaskId],
    references: [bigTasks.id],
    relationName: 'parent',
  })
}))
