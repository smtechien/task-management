import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { tasks } from '$lib/server/db/schema';
import { ilike, or, } from 'drizzle-orm';

// GET /api/tasks - fetch all tasks or by keyword
export async function GET({ url }) {
	try {
	  const keyword = url.searchParams.get('keyword');
    let allTasks;

    if (keyword) {
      allTasks = await db.query.tasks.findMany({
        where: or(
          ilike(tasks.title, `%${keyword}%`),
          ilike(tasks.description,`%${keyword}%`)
        ),
       orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
      })
    } else {
      allTasks = await db.query.tasks.findMany({
        orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
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
		const { title, description } = await request.json();
		if (!title) {
			return json({ message: 'Title is required' }, { status: 400 });
		}
		const [newTask] = await db
			.insert(tasks)
			.values({
				title,
				description,
				// other columns will use their default values;
			})
			.returning();
		return json(newTask, { status: 201 }); // 201 created
	} catch (error) {
		console.error('Error creating task: ', error);
		return json({ message: 'Failed to create task' }, { status: 500 });
	}
}
