import { json } from '@sveltejs/kit';
import { SmallTasksService } from '$lib/server/service/smallTasks.service';

// GET /api/tasks/[id]/small-tasks
export async function GET({ params }) {
  const bigTaskId = parseInt(params.id);
  if (isNaN(bigTaskId)) {
    return json({ message: 'Invalid Big Task Id' }, { status: 400 });
  }
  try {
    const smallTasks = await SmallTasksService.getByParentId(bigTaskId);
    return json(smallTasks, { status: 200 });
  } catch (error) {
    console.error(`API Error (GET /api/tasks/${bigTaskId}/small-tasks):`, error);
    return json({ message: 'Failed to retrieve small tasks for this big task'}, { status: 500 });
  }
}
