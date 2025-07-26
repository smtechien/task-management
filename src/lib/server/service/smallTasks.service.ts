import { db } from '$lib/server/db';
import { smallTasks } from '../db/schema';
import { eq, or, desc, ilike } from 'drizzle-orm';
import type { SmallTasks, NewSmallTasks, UpdateSmallTasksPayload } from '$lib/server/types';

export class SmallTasksService {
  // GET all tasks by search or keyword
  static async getAll(keyword?: string): Promise<SmallTasks[]> {
    if (keyword) {
      return db.query.smallTasks.findMany({
        where: or(
          ilike(smallTasks.title, `%${keyword}%` ),
          ilike(smallTasks.description, `%${keyword}%`),
        ),
        orderBy: [desc(smallTasks.createdAt)]
      });
    }
    return db.query.smallTasks.findMany({
        orderBy: [desc(smallTasks.createdAt)]
    });
  }

  // GET a single task by ID
  static async getById(id: number): Promise<SmallTasks | undefined> {
    return db.query.smallTasks.findFirst({
      where: eq(smallTasks.id, id)
    });
  }

  // GET smallTasks by parentTaskID
  static async getByParentId(parentTaskId: number): Promise<SmallTasks[]> {
    return db.query.smallTasks.findMany({
      where: eq(smallTasks.parentTaskId, parentTaskId),
      orderBy: [desc(smallTasks.createdAt)]
    })
  }

  // POST create a new task
  static async create(taskData: NewSmallTasks): Promise<SmallTasks> {
    const [newTask] = await db.insert(smallTasks).values(taskData).returning();
    return newTask
  }

  // PATCH partially update a task
  static async update(id: number, updateData: UpdateSmallTasksPayload): Promise<SmallTasks | undefined> {
    const now = new Date();
    const updatedAtString = now.toISOString();
    const payloadWithTimestamp = { ...updateData, updatedAt: updatedAtString };
    const [updatedTask] = await db.update(smallTasks)
      .set(payloadWithTimestamp)
      .where(eq(smallTasks.id, id))
      .returning();
    return updatedTask;
  }

  // DELETE a task by ID
  static async delete(id: number): Promise<boolean> {
    const result = await db.delete(smallTasks).where(eq(smallTasks.id, id)).returning();
    return result.length > 0;
  }
}
