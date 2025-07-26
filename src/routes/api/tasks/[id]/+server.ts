import { json } from '@sveltejs/kit';
import { BigTasksService } from '$lib/server/service/bigTasks.service';
import { patchBigTasksSchema } from '$lib/server/validation/tasks.validation'

// GET:ID - Fetching big task by ID
export async function GET({ params }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return json({ message: 'Invalid Task ID' }, { status: 400 });
  }

  try {
    const bigTask = await BigTasksService.getById(id);
    if (!bigTask) {
      return json({ message: 'Big Task not found' }, { status: 404 });
    }
    return json(bigTask, { status: 200 });
  } catch (error) {
    console.error(`API Error (GET /api/tasks/${id}:`, error);
    return json({ message: 'Failed to retrieve big task.' }, { status: 500 });
  }
}


// PATCH:ID - Update task's status of completion
export async function PATCH({ params, request }) {
  // parsing id into integer
  const id = parseInt(params.id);

  // make sure id is number
  if (isNaN(id)) {
    return json({ message: 'Invalid task ID'}, { status: 400 });
  }

  // try-catch to handling update action
  try {
    // get value from completed field
    const body = await request.json();
    const validatedData = patchBigTasksSchema.parse(body);

    if (Object.keys(validatedData)) {
      return json({ message: 'No valid fields provided for update'}, { status: 400 })
    }

    // check if any task get updated
    const updatedTask = await BigTasksService.update(id, validatedData);
    if (!updatedTask) {
      return json({ message: 'Task not found to update.' }, { status: 404 });
    }

    // returning the updatedTask and status code
    return json(updatedTask, { status: 200 });
  } catch (error) {
      //handling any error that might happen while updating the task
      console.error(`Error patching task ${id}`, error);
      return json({ message: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE:ID - delete task by id
export async function DELETE({ params }) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return json({ message: 'Invalid task ID'}, { status: 400 });
  }

  try {
    const wasDeleted = await BigTasksService.delete(id);
    if (!wasDeleted) {
      return json({ message: 'Task not found to delete.' }, { status: 404 });
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`Erorr deleting task ${id}: `, error);
    return json({ message: 'Failed to delete task'}, { status: 500 });
  }
}

