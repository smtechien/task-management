import { json } from '@sveltejs/kit';
import { SmallTasksService } from '$lib/server/service/smallTasks.service';
import { createSmallTasksSchema } from '$lib/server/validation/tasks.validation';

// GET /api/small-tasks - fetch all small tasks or search by keyword
export async function GET({ url }) {
  try {
    const keyword = url.searchParams.get('keyword') || undefined;
    const smallTasks = await SmallTasksService.getAll(keyword);
    return json(smallTasks, { status: 200 });
  } catch (error) {
    console.error('API error (GET /api/small-tasks): ', error);
    return json({ message: 'Failed to retrieve small tasks.'}, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const body = await request.json();
    const validatedData = createSmallTasksSchema.parse(body);
    const newSmallTask = await SmallTasksService.create(validatedData);
    return json(newSmallTask, { status: 201 })
  } catch (error) {
    console.error('API Error (POST /api/small-tasks): ', error);
    return json({ message: 'Failed to create small task.'}, { status:  500 });
  }
}
