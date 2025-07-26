import { json } from '@sveltejs/kit';
import { BigTasksService } from '$lib/server/service/bigTasks.service.js';
import { createBigTasksSchema } from '$lib/server/validation/tasks.validation';
import { ZodError } from 'zod';



// GET /api/tasks - fetch all tasks or by keyword
export async function GET({ url }) {
	try {
    const keyword = url.searchParams.get('keyword') || undefined;
    const bigTasks = await BigTasksService.getAll(keyword);
		return json(bigTasks, { status: 200 });
	} catch (error) {
		console.error('Error fetching tasks: ', error);
		return json({ message: 'Failed to fetch tasks' }, { status: 500 });
	}
}

//POST /api/tasks - create a new task
export async function POST({ request }) {
	try {
    const body = await request.json();
    const validatedData = createBigTasksSchema.parse(body);
    const newBigTask  = await BigTasksService.create(validatedData);
		return json(newBigTask, { status: 201 }); // 201 created
	} catch (error) {
    if (error instanceof ZodError) {
      // const formattedError = error.flatten().fieldErrors;
      return json({
        message: 'Validation failed',
      }, { status: 400 });
}
		return json({ message: 'Failed to create task' }, { status: 500 });
	}
}
