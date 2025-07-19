import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { bigTasks } from '$lib/server/db/schema';
import { ilike, or, } from 'drizzle-orm';

// GET /api/tasks - fetch all tasks or by keyword
export async function GET({ url }) {
	try {
	  const keyword = url.searchParams.get('keyword');
    let allTasks;

    if (keyword) {
      allTasks = await db.query.bigTasks.findMany({
        where: or(
          ilike(bigTasks.title, `%${keyword}%`),
          ilike(bigTasks.description,`%${keyword}%`)
        ),
       orderBy: (bigTasks, { desc }) => [desc(bigTasks.createdAt)],
      })
    } else {
      allTasks = await db.query.bigTasks.findMany({
        orderBy: (bigTasks, { desc }) => [desc(bigTasks.createdAt)],
      })

    }
		return json(allTasks, { status: 200 });
	} catch (error) {
		console.error('Error fetching tasks: ', error);
		return json({ message: 'Failed to fetch tasks' }, { status: 500 });
	}
}

//POST /api/tasks - create a new task
export async function POST({ request }) {
	try {
		const { title, description, details, dueDate, isCompleted } = await request.json();
		if (!title) {
			return json({ message: 'Title is required' }, { status: 400 });
		}
		const [newTask] = await db
			.insert(bigTasks)
			.values({
				title,
				description,
        details,
        dueDate,
        isCompleted,
				// other columns will use their default values;
			})
			.returning();
		return json(newTask, { status: 201 }); // 201 created
	} catch (error) {
		console.error('Error creating task: ', error);
		return json({ message: 'Failed to create task' }, { status: 500 });
	}
}
