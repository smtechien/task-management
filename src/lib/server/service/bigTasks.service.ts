import { db } from '$lib/server/db';
import { bigTasks } from '../db/schema';
import { eq, or, desc, ilike } from 'drizzle-orm';
import type { BigTasks, NewBigTasks, UpdateBigTasksPayload } from '$lib/server/types';

export class BigTasksService {
  // GET all tasks by search or keyword
  static async getAll(keyword?: string): Promise<BigTasks[]> {
    if (keyword) {
      return db.query.bigTasks.findMany({
        where: or(
          ilike(bigTasks.title, `%${keyword}%` ),
          ilike(bigTasks.description, `%${keyword}%`),
        ),
        orderBy: [desc(bigTasks.createdAt)]
      });
    }
    return db.query.bigTasks.findMany({
        orderBy: [desc(bigTasks.createdAt)]
    });
  }

  // GET a single task by ID
  static async getById(id: number): Promise<BigTasks | undefined> {
    return db.query.bigTasks.findFirst({
      where: eq(bigTasks.id, id)
    });
  }

  // POST create a new task
  static async create(taskData: NewBigTasks): Promise<BigTasks> {
    const [newTask] = await db.insert(bigTasks).values(taskData).returning();
    return newTask;
  }

  // PATCH partially update a task
  static async update(id: number, updateData: UpdateBigTasksPayload): Promise<BigTasks | undefined> {
    const now = new Date();
    const updatedAtString = now.toISOString();
    const payloadWithTimestamp = { ...updateData, updatedAt: updatedAtString };
    const [updatedTask] = await db.update(bigTasks)
      .set(payloadWithTimestamp)
      .where(eq(bigTasks.id, id))
      .returning();
    return updatedTask;
  }

  // DELETE a task by ID
  static async delete(id: number): Promise<boolean> {
    const result = await db.delete(bigTasks).where(eq(bigTasks.id, id)).returning();
    return result.length > 0;
  }
}
