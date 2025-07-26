import { json } from '@sveltejs/kit';
import { SmallTasksService } from '$lib/server/service/smallTasks.service';
import { patchSmallTaskSchema } from '$lib/server/validation/tasks.validation';

// GET /api/small-tasks/[id] - Fetch a single small task by ID
export async function GET({ params }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return json({ message: 'Invalid Task ID'}, { status: 400 });
  }
  try {
    const smallTask = await SmallTasksService.getById(id);
    if (!smallTask) {
      return json({ message: 'Small Task not found' }, { status: 404 });
    }
    return json(smallTask, { status: 200 });
  } catch (error) {
    console.error(`API Error (GET /api/small-tasks/${id}): `, error);
    return json({ message: 'Failed to retrieve small task.' }, { status: 500 });
  }
}

export async function PATCH({ params, request }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return json({ message: 'Invalid Task ID' }, { status: 400 });
  }
  try {
    const body = await request.json();
    const validatedData = patchSmallTaskSchema.parse(body);
    if (Object.keys(validatedData).length === 0) {
      return json({ message: 'No valid fields provided for update.' }, { status: 400 });
    }
    const updatedSmallTask = await SmallTasksService.update(id, validatedData);
    if (!updatedSmallTask) {
      return json({ message: 'Small Task not found to update.' }, { status: 404 });
    }
    return json(updatedSmallTask, { status: 200 });
  } catch (error) {
    console.error(`API Error (PATCH /api/small-tasks/${id}):`, error);
    return json({ message: 'Failed to update small task.' }, { status: 500 });
  }
}

// DELETE /api/small-tasks/[id] - Delete a small task
export async function DELETE({ params }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return json({ message: 'Invalid task ID' }, { status: 400 });
  }
  try {
    const wasDeleted = await SmallTasksService.delete(id);
    if (!wasDeleted) {
      return json({ message: 'Small task not found to delete.'}, { status: 404 });
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`API Error (DELETE /api/small-tasks/${id}):`, error);
    return json({ message: 'Failed to delete small task.' }, { status: 500 });
  }
}
